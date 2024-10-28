const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regef for email format 
const passwordRegex = /^.{6,25}$/;// Regef for secure password normal password which has their 6 character long length 
const adminPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Regef for secure password where length should be 8, one special character, at least one number, one capital character 
const dateRegex = /^(0[1-9]|[12][0-9]|3[01]) (0[1-9]|1[0-2]) (19|20)\d\d$/; // Regular expression for "DD MM YYYY" format
const fuelPrice = 283.79; // fuel price

export { emailRegex, passwordRegex, adminPasswordRegex, dateRegex, fuelPrice };
