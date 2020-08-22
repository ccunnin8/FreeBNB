export const tokenNotExpired = () => {
    // checks if token-refresh-date exists
    // returns true if date <= 7 days, false otherwise 
    let last = localStorage.getItem("token-refresh-date")
    if (last) {
      const now = new Date();
      return ((now - last) / (1000 * 24 * 60 * 60)) <= 7;
    } 
    return false;
  }