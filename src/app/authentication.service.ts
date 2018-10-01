import { Injectable } from '@angular/core';
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import * as request from "request";
import * as jwkToPem from "jwk-to-pem";
import * as jwt from "jsonwebtoken";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
const poolData = {
  UserPoolId: "eu-central-1_XWqoZFTNG", // Your user pool id here    
  ClientId: "6tia1oh20d266r8ukeco5a8kgk" // Your client id here
};
const pool_region = 'eu-central-1';
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export class AuthenticationService {
  registerUser(newUserData, callback) {
    let attributeList = [];
    for(var key in newUserData){
      attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: key, Value: newUserData[key] }));
    }
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: newUserData.name }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "picture", Value: newUserData.picture }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: newUserData.email }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "gender", Value: newUserData.gender }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "birthdate", Value: newUserData.birthdate }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "locale", Value: "EN_US" }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: "+5412614324321" }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "address", Value: "CMB" }));

    userPool.signUp(newUserData.email, 'SamplePassword123', attributeList, null, function (err, result) {
      if (err) {
        console.log(err);
        callback();
        return;
      }
      const cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());
      callback(true);
    });
  }

  login(userName, password, callback)  {
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: userName,
      Password: password,
    });

    let userData = {
      Username: 'sampleEmail@gmail.com',
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        console.log('refresh token + ' + result.getRefreshToken().getToken());
        callback(true);
      },
      onFailure: function (err) {
        console.log(err);
        callback();
      },

    });
  }

  signOut() {
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: 'sampleEmail@gmail.com',
      Password: 'SamplePassword123',
    });

    let userData = {
      Username: 'sampleEmail@gmail.com',
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    if (cognitoUser != null) {
      cognitoUser.signOut();
    }
  }

  update(username, password) {
    let attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "custom:scope",
      Value: "some new value"
    }));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: "some new value"
    }));

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let userData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.updateAttributes(attributeList, (err, result) => {
      if (err) {
        //handle error
      } else {
        console.log(result);
      }
    });
  }

  ValidateToken(token) {
    request({
      url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        pems = {};
        let keys = body['keys'];
        for (let i = 0; i < keys.length; i++) {
          //Convert each key to PEM
          let key_id = keys[i].kid;
          let modulus = keys[i].n;
          let exponent = keys[i].e;
          let key_type = keys[i].kty;
          let jwk = { kty: key_type, n: modulus, e: exponent };
          let pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
        //validate the token
        let decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          console.log("Not a valid JWT token");
          return;
        }

        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
          console.log('Invalid token');
          return;
        }

        jwt.verify(token, pem, function (err, payload) {
          if (err) {
            console.log("Invalid Token.");
          } else {
            console.log("Valid Token.");
            console.log(payload);
          }
        });
      } else {
        console.log("Error! Unable to download JWKs");
      }
    });
  }

  renew() {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: "your_refresh_token_from_a_previous_login" });

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
      Username: "sample@gmail.com",
      Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
      if (err) {
        console.log(err);
      } else {
        let retObj = {
          "access_token": session.accessToken.jwtToken,
          "id_token": session.idToken.jwtToken,
          "refresh_token": session.refreshToken.token,
        }
        console.log(retObj);
      }
    })
  }

  DeleteUser() {
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let userData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        cognitoUser.deleteUser((err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully deleted the user.");
            console.log(result);
          }
        });
      },
      onFailure: function (err) {
        console.log(err);
      },
    });
  }

  deleteAttributes(username, password) {
    let attributeList = [];
    attributeList.push("custom:scope");
    attributeList.push("name");

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let userData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.deleteAttributes(attributeList, (err, result) => {
      if (err) {
        //handle error
      } else {
        console.log(result);
      }
    });
  }

  ChangePassword(username, password, newpassword) {
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let userData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        cognitoUser.changePassword(password, newpassword, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully changed password of the user.");
            console.log(result);
          }
        });
      },
      onFailure: function (err) {
        console.log(err);
      },
    });
  }

  constructor() { }
}
