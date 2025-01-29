let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const GetDay = (timeStamp) => {
    // Ensure timeStamp is valid
    timeStamp=timeStamp.timeStamp;
    if (!timeStamp) {
        console.error('Invalid timeStamp:', timeStamp); // Log if the timeStamp is missing or invalid
        return null; // Handle invalid timeStamp gracefully
    }

    let date = new Date(timeStamp);
    
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', date); // Log if the date is invalid
        return null; // Handle invalid date gracefully
    }

    let day = days[date.getDay()]; // Gets the day of the week (e.g., "Sunday")
    let dayOfMonth = date.getDate(); // Gets the day of the month (e.g., 1, 2, 3...)
    let monthName = month[date.getMonth()]; // Gets the month name (e.g., "Jan", "Feb")

    return `${day}, ${dayOfMonth} ${monthName}`;
}
