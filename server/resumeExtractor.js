
// Utility functions for extracting specific data
const extractName = (text) => {
    const nameRegex = /([A-Z][a-z]*\s[A-Z][a-z]*)/; // Match first and last name
    return text.match(nameRegex)?.[0] || "Name not found";
  };
  
  const extractEmail = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    return text.match(emailRegex)?.[0] || "Email not found";
  };
  
  const extractPhone = (text) => {
    const phoneRegex =
      /\+?[0-9]{1,4}?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g;
    return text.match(phoneRegex)?.[0] || "Phone number not found";
  };
  
  const extractProfession = (text) => {
    const professionRegex =
      /(app developer|web developer|fullstack developer|MERN|software engineer|designer|manager|analyst|administrator|programmer)/i;
    return text.match(professionRegex)?.[0] || "Profession not found";
  };
  
  // Function to extract all information from resume text
  const extractInformationFromRawResumeText = (text) => ({
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    profession: extractProfession(text),
  });
  
  export default extractInformationFromRawResumeText;
  