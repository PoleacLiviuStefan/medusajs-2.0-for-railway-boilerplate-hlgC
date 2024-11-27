const axios = require("axios");

class FanCourierService {
  constructor({ logger }) {
    this.logger = logger;
    this.baseUrl = "https://www.selfawb.ro"; // URL API FanCourier
    this.username = process.env.FANCOURIER_USERNAME; // Setează în .env
    this.password = process.env.FANCOURIER_PASSWORD;
    this.clientId = process.env.FANCOURIER_CLIENT_ID;
  }

  /**
   * Creează o livrare cu FanCourier
   * @param {object} order - Detaliile comenzii
   */
  async createFulfillment(order) {
    try {
      const response = await axios.post(`${this.baseUrl}/export_awb.php`, {
        client_id: this.clientId,
        user: this.username,
        pass: this.password,
        destinatar: order.shipping_address.full_name,
        localitate: order.shipping_address.city,
        judet: order.shipping_address.province,
        strada: order.shipping_address.address_1,
        telefon: order.shipping_address.phone,
        greutate: order.items.reduce((acc, item) => acc + item.weight, 0),
        valoare: order.total / 100, // În lei
        ramburs: order.total / 100,
        cont_colector: "contul_clientului", // Specific contul tău FanCourier
      });

      const awbNumber = response.data?.awb || "N/A";

      this.logger.info(`AWB generat pentru comanda ${order.id}: ${awbNumber}`);

      return {
        id: awbNumber,
        tracking_numbers: [awbNumber],
      };
    } catch (error) {
      this.logger.error("Eroare la crearea AWB-ului:", error.message);
      throw new Error("Nu s-a putut crea AWB-ul pentru FanCourier.");
    }
  }

  /**
   * Preia informații despre livrare (tracking)
   * @param {string} awb - Numărul AWB
   */
  async getTrackingInfo(awb) {
    try {
      const response = await axios.post(`${this.baseUrl}/tracking_awb_integrat.php`, {
        client_id: this.clientId,
        user: this.username,
        pass: this.password,
        awb,
      });

      return response.data;
    } catch (error) {
      this.logger.error("Eroare la preluarea informațiilor de tracking:", error.message);
      throw new Error("Nu s-au putut prelua informațiile de tracking.");
    }
  }
}

module.exports = FanCourierService;
