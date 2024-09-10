import Cookies from 'js-cookie';

// export function getTokenDuration() {
//     const storedExpirationDate = localStorage.getItem("expiration");
//     const expirationDate = new Date(storedExpirationDate);
//     const now = new Date();
//     const duration = expirationDate.getTime() - now.getTime();
//     return duration;
//   }
  
  export function getAuthToken() {
    // const token = localStorage.getItem("token");
    const token = Cookies.get('clue_chaser_member_token');
  
    if (!token) {
      return null;
    }  
  
    return token;
  }
  
  export function tokenLoader() {
    const token = getAuthToken();
    return token;
  }
  
  export function checkAuthLoader() {
    const token = getAuthToken();
  
    if (!token) {
      return redirect("/auth");
    }
  
    return null;
  }
  