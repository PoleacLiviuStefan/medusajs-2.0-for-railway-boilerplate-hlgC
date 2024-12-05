import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Calendar } from "@medusajs/ui";
import { useState, useEffect, useRef } from "react";

const ModifyCoursesDates = () => {
  //const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [changeInput, setChangeInput] = useState({
    courseName: "",
    dateIndex: -1,

    duration: null, // Noua proprietate pentru durata
  });

  const [addDateInput, setAddDateInput] = useState(-1);
  const [sureDeleteModal, setSureDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(-1);
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [editCourseModal, setEditCourseModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [isContentShown, setIsContentShow] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const editCourseNameRef = useRef();
  const courseNameRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/external");
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result.courses);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleDurationChange = (e, courseId) => {
    const newDuration = parseInt(e.target.value, 10);
  
    if (isNaN(newDuration) || newDuration < 1) {
      console.error("Durata introdusă nu este validă");
      return;
    }
  
    setIsModified(true);
  
    setData((prevData) =>
      prevData.map((course) => {
        if (course.id === courseId) {
          const updatedStartDates = course.start_dates.map((startDate) => {
            const startDateObj = new Date(startDate);
            const endDate = new Date(
              startDateObj.getTime() + (newDuration - 1) * 24 * 60 * 60 * 1000
            );
            return {
              startDate: startDateObj.toISOString(),
              endDate: endDate.toISOString(),
            };
          });
  
          return {
            ...course,
            duration: newDuration,
            start_dates: updatedStartDates.map((d) => d.startDate),
            end_dates: updatedStartDates.map((d) => d.endDate),
          };
        }
        return course;
      })
    );
  
    console.log("Durată schimbată pentru cursul cu id:", courseId);
  };
  
  const handleEditCourseName = async () => {
    const newName = editCourseNameRef.current.value;
    if (!newName || !courseToEdit) return;

    try {
      const response = await fetch("/external/course", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseToEdit.id, newName }),
      });

      if (!response.ok)
        throw new Error("Eroare la actualizarea numelui cursului");

      setData((prevData) =>
        prevData.map((course) =>
          course.id === courseToEdit.id ? { ...course, name: newName } : course
        )
      );
      setEditCourseModal(false);
      setCourseToEdit(null);
    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  const handleDateChange = (date) => {
    setIsModified(true);
    console.log("dateCurrent", date);
    console.log("changeInput", changeInput);
    console.log("data", data);

    if (changeInput.courseName && changeInput.dateIndex >= 0) {
      setData((prevData) =>
        prevData.map((course) => {
          if (course.name === changeInput.courseName) {
            // Asigurăm că `start_dates` este întotdeauna un array
            const updatedCourse = {
              ...course,
              start_dates: Array.isArray(course.start_dates)
                ? [...course.start_dates]
                : [],
            };
    
            // Adăugăm sau actualizăm data
            updatedCourse.start_dates[changeInput.dateIndex] = date.toISOString();
            console.log("updatedCourse ", updatedCourse);
            return updatedCourse; // Returnăm cursul modificat
          }
          return course; // Returnăm cursul nemodificat
        })
      );
    
      setChangeInput({ courseName: "", dateIndex: -1 });
    }
    
    
  };

  const handleAddCourse = async () => {
    const newCourseName = courseNameRef.current.value;
    if (!newCourseName) return;

    try {
      const response = await fetch("/external/course/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourseName,
          start_date: null,
        }),
      });
      if (!response.ok) throw new Error("Eroare la adăugarea cursului");

      const newCourse = await response.json();
      setData((prevData) => [...prevData, newCourse]);
      setAddCourseModal(false);
    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  const handleAddDate = async (date) => {
    console.log("handleAddDate: ", data[addDateInput]);
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch("/external/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: data[addDateInput].id,
          newDate: formattedDate,
        }),
      });
      if (!response.ok) throw new Error("Eroare la adăugarea datei");

      setData((prevData) =>
        prevData.map((course, index) =>
          index === addDateInput
            ? {
                ...course,
                available_dates: [
                  ...course?.available_dates,
                  { dateStart: date },
                ],
              }
            : course
        )
      );
      setAddDateInput(-1);
    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  const handleSave = async (course) => {
    try {
      const formattedDates = Array.isArray(course.start_dates)
        ? course.start_dates.map((date) => {
            if (!date) return null;

            const localDate = new Date(date);
            localDate.setMinutes(
              localDate.getMinutes() - localDate.getTimezoneOffset()
            );

            return localDate.toISOString().split("T")[0];
          })
        : [];

      // Verificăm dacă există o modificare a duratei în `changeInput`
      const duration =
        changeInput.duration !== null ? changeInput.duration : course.duration;

      const response = await fetch("/external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          start_dates: formattedDates,
          duration,
        }),
      });

      if (!response.ok) throw new Error("Failed to save course dates");

      alert("Datele cursului au fost actualizate cu succes!");
    } catch (err) {
      alert("Eroare la actualizarea datelor cursului: " + err.message);
    } finally {
      setChangeInput({
        courseName: "",
        dateIndex: -1,
      });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch("/external/course", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (!response.ok) throw new Error("Eroare la ștergerea cursului");

      alert("Cursul a fost șters cu succes!");
      setData((prevData) =>
        prevData.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  const handleDeleteDate = async (courseId, dateIndex) => {
    try {
      const response = await fetch("/external", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          dateIndex,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Eroare necunoscută la ștergerea datei"
        );
      }

      alert("Data a fost ștearsă cu succes!");
      setData((prevData) =>
        prevData.map((course) =>
          course.id === courseId
            ? {
                ...course,
                start_dates: course.start_dates.filter(
                  (_, index) => index !== dateIndex
                ),
              }
            : course
        )
      );
    } catch (error) {
      console.error("Eroare:", error.message);
      alert(`Eroare la ștergerea datei: ${error.message}`);
    }
  };

  const formatDate = (date) => {
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return ""; // Sau un mesaj, cum ar fi "Data Invalidă"
    }
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="relative divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <h2>Schimbare Data curs</h2>
        <button
          className="border-[1px] border-white px-2 py-1 rounded-lg text-md hover:bg-white hover:border-black hover:text-black"
          onClick={() => setIsContentShow(!isContentShown)}
        >
          {isContentShown ? "Ascunde" : "Afiseaza"}
        </button>
      </div>
      {isContentShown && (
        <>
          <div className="flex flex-col">
            <button
              className="bg-green-500 px-4 py-2 rounded-lg text-[13px] lg:text-[16px] w-[120px] lg:w-[150px]"
              onClick={() => setAddCourseModal(true)}
            >
              Adaugă Curs
            </button>
          </div>
          {addCourseModal && (
            <div className="fixed flex items-center justify-center w-full h-full bg-black bg-opacity-50 top-0 left-0 z-50">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex flex-col items-center justify-center shadow-xl w-[400px] h-[300px] bg-gray-800 rounded-lg p-4 text-white"
              >
                <button
                  onClick={() => setAddCourseModal(false)}
                  className="absolute right-2 top-2 bg-red-500 p-2 text-[20px] text-white rounded-lg"
                >
                  X
                </button>
                <label className="font-bold mb-2">Numele Cursului</label>
                <input
                  ref={courseNameRef}
                  className="w-full px-2 border-[1px] border-white bg-transparent rounded-md mb-4"
                />
                <button
                  onClick={handleAddCourse}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Salvează Cursul
                </button>
              </form>
            </div>
          )}
          {editCourseModal && (
            <div className="fixed flex items-center justify-center w-full h-full bg-black bg-opacity-50 top-0 left-0 z-50">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex flex-col items-center justify-center shadow-xl w-[400px] h-[300px] bg-gray-800 rounded-lg p-4 text-white"
              >
                <button
                  onClick={() => setEditCourseModal(false)}
                  className="absolute right-2 top-2 bg-red-500 p-2 text-[20px] text-white rounded-lg"
                >
                  X
                </button>
                <label className="font-bold mb-2">
                  Editează Numele Cursului
                </label>
                <input
                  ref={editCourseNameRef}
                  defaultValue={courseToEdit ? courseToEdit.name : ""}
                  className="w-full px-2 border-[1px] border-white bg-transparent rounded-md mb-4"
                />
                <button
                  onClick={handleEditCourseName}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Salvează Numele
                </button>
              </form>
            </div>
          )}
          {data && (
            <div className="flex flex-col lg:flex-row justify-center lg:items-center w-full gap-[16px] mt-[32px]">
              {data.map((course, courseIndex) => (
                <div
                  key={course.id}
                  className="relative flex flex-col w-full lg:w-[450px] gap-[8px] text-center bg-gray-600 p-4"
                >
                  <div className="relative flex flex-col lg:flex-row justify-center w-full ">
                    <h3 className="text-[20px] lg:text-[24px] font-extrabold">
                      {course.name}
                    </h3>
                  </div>
                  <ul className="flex flex-col items-center gap-[8px]">
                    {course?.start_dates?.map((date, dateIndex) => (
                      <li
                        key={dateIndex}
                        className="flex flex-col items-center justify-center gap-[4px] p-[4px] w-full"
                      >
                        <div className="flex flex-col gap-[8px]">
                          <div>
                            <label>Data incepere</label>
                            <input
                              value={formatDate(date)}
                              className="bg-transparent w-[150px] text-center p-0 font-bold text-[16px] lg:text-[20px]"
                              disabled
                            />
                            {course.duration !== 1 && (
                              <div>
                                <label>Data Sfarsit</label>
                                <input
                                  value={formatDate(
                                    new Date(
                                      new Date(date).getTime() +
                                        ( course?.duration - 1) *
                                          24 *
                                          60 *
                                          60 *
                                          1000
                                    )
                                  )}
                                  className="bg-transparent w-[150px] text-center p-0 font-bold text-[16px] lg:text-[20px]"
                                  disabled
                                />
                              </div>
                            )}
                            <button
                              className="bg-red-500 p-2 w-full mt-1"
                              onClick={() =>
                                handleDeleteDate(course.id, dateIndex)
                              }
                            >
                              Sterge Data
                            </button>
                            <button
                              className="bg-blue-500 p-2 w-full"
                              onClick={() =>
                                setChangeInput({
                                  courseName: course.name,
                                  dateIndex,
                                })
                              }
                            >
                              Schimba
                            </button>
                          </div>

                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center w-full">
                            <label>Durata curs</label>
                            <input
                              type="number"
                              defaultValue={course.duration}
                              onChange={(e) =>
                                handleDurationChange(e, course.id)
                              }
                              className="bg-transparent w-[150px] text-center p-0 font-bold text-[16px] lg:text-[20px]"
                            />
                            zile
                          </div>
                  <button
                    className="bg-blue-500 mt-2 p-2 text-[13px] lg:text-[16px]"
                    onClick={() => setAddDateInput(courseIndex)}
                  >
                    Adaugă Data
                  </button>
                  <button
                    className={`${
                      isModified
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-yellow-500 hover:bg-yellow-400"
                    } mt-2 p-2 text-[13px] lg:text-[16px]`}
                    onClick={() => handleSave(course)}
                  >
                    {isModified
                      ? "Salvează Datele Schimbate"
                      : "Nimic de salvat"}
                  </button>
                  <button
                    onClick={() => {
                      setSureDeleteModal(true);
                      setCourseToDelete(course.id);
                    }}
                    className="bg-red-500 mt-2 p-2 text-[13px] lg:text-[16px]"
                  >
                    Șterge Curs
                  </button>
                </div>
              ))}
            </div>
          )}
          {(changeInput.courseName !== "" && changeInput.dateIndex >= 0) ||
          addDateInput !== -1 ? (
            <div className="fixed flex items-center justify-center w-full h-full bg-black bg-opacity-50 top-0 left-0 z-50">
              <div className="bg-black p-6 rounded-md text-center z-50">
                <Calendar
                  onChange={
                    addDateInput !== -1 ? handleAddDate : handleDateChange
                  }
                />
                {/*addDateInput !== -1 && (
                  <div>
                    <label>Durata</label>
                    <input />
                  </div>
                )*/}
                <button
                  onClick={() => {
                    setChangeInput({
                      courseName: "",
                      dateIndex: -1,
                    });
                    setAddDateInput(-1);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Anulează {changeInput.courseName} {addDateInput}
                </button>
              </div>
            </div>
          ) : null}
          {error && (
            <div className="px-6 py-4 text-red-500">
              <p>Eroare: {error}</p>
            </div>
          )}
          {sureDeleteModal && (
            <div className="fixed flex items-center justify-center w-full h-full bg-black bg-opacity-50 top-0 left-0 z-50">
              <div className="relative flex flex-col items-center justify-center shadow-xl w-[400px] h-[300px] bg-gray-200 rounded-lg text-black p-4">
                <button
                  onClick={() => setSureDeleteModal(false)}
                  className="absolute right-2 top-2 bg-red-500 p-2 text-[20px] text-white rounded-lg"
                >
                  X
                </button>
                <p className="text-[18px] lg:text-[24px] text-center">
                  Ești sigur că vrei să ștergi cursul?
                </p>
                <button
                  onClick={() => {
                    handleDeleteCourse(courseToDelete);
                    setSureDeleteModal(false);
                  }}
                  className="w-full bg-red-500 text-white p-4 font-bold text-[18px]"
                >
                  Șterge
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.list.before",
});

export default ModifyCoursesDates;
