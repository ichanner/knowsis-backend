import crypto from 'crypto'

export default (length: number = 6) : string => {
 
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
  let result = '';
  
  const random_bytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    
    const random_index = random_bytes[i] % characters.length; // Ensure index is within the characters' range
    
    result += characters[random_index];
  }
  
  return result;
}
