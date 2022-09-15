import { HttpGet } from "../../services/api-services";
import { BASE_URI, GET_USER } from "../../constants/endpoints";

export const fetchLoggedInUserDetails = async () => {
  try {
      let credentials = "Bearer " + localStorage.getItem("token");
      let apiUrl = BASE_URI + GET_USER + localStorage.getItem("loginId");
      let headers = {
          "Authorization": credentials
      }
      let response = await HttpGet(apiUrl, {}, headers)
    //   let response = {
    //       data: {
    //           "usersDto": [
    //               {
    //                   "loginId": "rosh",
    //                   "firstName": "roshini",
    //                   "lastName": "gopalakrishnan",
    //                   "emailId": "roshini@gmail.com",
    //                   "password": "roshini",
    //                   "contactNumber": 1234567890,
    //                   "loggedIn": null
    //               }
    //           ]
    //       }
    //   }
      return response.data.usersDto[0];
  } catch (e) {
      throw e;
  }
}
