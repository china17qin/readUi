import { User, Login } from './../../model/model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import AV from "leancloud-storage";
import { HttpProvider } from '../http/http';
import { NativeProvider } from '../native/native';

/*
  Generated class for the UserServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServicesProvider {

  constructor(
    public http: HttpProvider,
    private native: NativeProvider
  ) {

  }


  /**
   * 用户登录
   *
   * @author qin
   * @param {Login} body
   * @returns {Observable<User>}
   * @memberof UserServicesProvider
   */
  userLogin(body: Login): Observable<User> {
    return new Observable(observable => {
      this.http.get('login.json', body).subscribe((f: any) => {
        observable.next(f.data)
      }, err => {
        console.log('登录错误,', err);
      })
    })
  }


  userRejister(): void {
    let UserObject = AV.Object.extend('_User');
    let userObject = new UserObject();
    let date = new Date();
    userObject.set('username', '秦小波');
    userObject.set('mobilePhoneNumber', '15016952559');
    userObject.set('password', 'xiaobo1992');
    userObject.save().then((f) => {
      console.log('云端返回数据是,', f)
    }, (error) => {
      console.log('云端返回错误是,', error)
    });
  }

  /**
   * 发送验证码
   * 
   * @author qin
   * @param {number} phone 
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  sendAuthCode(phone: number): Promise<any> {
    return new Promise((resolve, reject) => {
      AV.Cloud.requestSmsCode(`${phone}`).then((success) => {
        resolve(success)
        console.log('发送短信验证码回掉信息是',success);
        
      }, (error) => {
        reject(error)
        console.log('发送短信验证码错误回掉信息是',error);
      });
    })
  }

  /**
   * 验证码登录
   * 
   * @author qin
   * @param {number} phone 
   * @param {number} authCode 
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  loginByAuthCode(phone: number, authCode: number): Promise<any> {
    return new Promise((resolve, reject) => {
      AV.User.signUpOrlogInWithMobilePhone(`${phone}`, `${authCode}`).then((success: any) => {
        let userInfo = JSON.parse(JSON.stringify(success));
        userInfo.sessionToken = success._sessionToken;
        console.log(JSON.stringify("返回信息",success));

        resolve(userInfo)
      }, (error) => {
        let json = JSON.parse(JSON.stringify(error));
        if (json.code == 603) {
          reject({
            stu: false,
            data: '验证码错误'
          })
        } else {
          reject({
            stu: false,
            data: '系统错误，请提交反馈'
          })
        }
      });
    })
  }


  /**
   * 退出登录
   * 
   * @author qin
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  loginOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      AV.User.logOut().then(success => {
        console.log('退出登录信息', success);
        resolve()
      }, err => {
        console.log('退出失败信息', err)
        reject()
      })
    }
    )
  }

  /**
   * 上传头像
   * 
   * @author qin
   * @param {string} imgDate 
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  uploadAvatar(imgDate: string): Promise<any> {
    let img = { base64: imgDate };
    let file = new AV.File('avatar.jpg', img);
    return new Promise((resolve, reject) => {
      let currentUser = AV.User.current();
      if (!currentUser) {
        reject({
          stu: false,
          message: '无效的用户',
          data: ''
        })
      }
      let userCourseMapTom = new AV.Object('UserCourseMap');
      userCourseMapTom.set('user', currentUser);
      userCourseMapTom.set('avatar', file);
      let map = userCourseMapTom.save();
      let uploadImg = file.save();
      Promise.all([uploadImg, map]).then(f => {
        resolve({
          stu: true,
          message: '上传成功',
          data: f
        })
      }, err => {
        reject({
          stu: false,
          message: '服务器错误',
          data: err
        })
      })
    })
  }


  /**
   * 校验用户状态是否合法
   * 
   * @author qin
   * @returns {Promise<boolean>} 
   * @memberof UserServicesProvider
   */
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let currentUser = AV.User.current();      // 获取当前登录的用户
      currentUser.isAuthenticated().then((authenticated) => {
        resolve(authenticated)
      }, err => {
        reject(err)
      })
    })
  }

  /**
   * 查询用户信息
   * 
   * @author qin
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isAuthenticated().then(f => {
        if (f) {
          let currentUser = AV.User.current();      // 获取当前登录的用户
          let query = new AV.Query('UserCourseMap');
          let sessionToken = AV.User.current().getSessionToken();
          AV.User.become(sessionToken).then((user: any) => {
            query.equalTo('user', user);        // 表明查询对象为当前用户
            query.include('user');
            query.descending('updatedAt');
            query.first().then((date: any) => {
              resolve({ stu: true, message: '查询成功', data: date.toJSON() })            // 查询结果
            }, err => {
              reject({ stu: false, message: '查询失败', data: err })                       // 异常信息
            });
          })
        } else {
          reject({ stu: false, message: '无效的用户', data: '' })
        }
      }, err => {
        reject({ stu: false, message: '系统错误，请提交反馈', data: '' })
      })
    })
  }

  /**
   * 存储登录用户信息
   * 
   * @author qin
   * @returns {Promise<any>} 
   * @memberof UserServicesProvider
   */
  setUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUserInfo().then(f => {
        if (f.stu) {
          this.native.setStorage("_ReadUiIonicUserInfo", f.data).then(f => {
            resolve(f)
          }, err => {
            reject({
              stu: false,
              message: "setUserInfo：数据写入失败",
              data: ""
            });
          })
        } else {
          resolve({
            stu: false,
            message: "setUserInfo：无效的用户状态",
            data: ""
          });
        }
      })
    })
  }


}
