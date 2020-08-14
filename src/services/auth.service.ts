import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ConfigService } from './config.service';
import { User } from '../model/user';

@Injectable()
export class AuthService {

	isLoggedIn = false;
	token: any;
	
	constructor(
		private http: HttpClient,
		private storage: NativeStorage,
		private env: ConfigService,
	) {}

	login(email: String, password: String) {
		return this.http.post(this.env.API_URL + 'auth/login', {
			email: email,
			password: password
		}).pipe(
			tap(token => {
				this.storage.setItem('token', token)
					.then(
						() => {
							console.log('Token stored.');
						},
						error => console.error('Error storing item', error)
					);
				this.token = token;
				this.isLoggedIn = true;
				return token;
			}),
		);
	}

	register(name: String, email: String, password: String) {
		return this.http.post(this.env.API_URL + 'auth/register', {
			name: name,
			email: email,
			password: password
		})
	}

	logout() {
		const headers = new HttpHeaders({
			'Authorization': this.token["token_type"] + " " + this.token["access_token"]
		});
		return this.http.get(this.env.API_URL + 'auth/logout', {
				headers: headers
			})
			.pipe(
				tap(data => {
					this.storage.remove("token");
					this.isLoggedIn = false;
					delete this.token;
					return data;
				})
			)
	}

	user() {
		const headers = new HttpHeaders({
			'Authorization': this.token["token_type"] + " " + this.token["access_token"]
		});
		return this.http.get < User > (this.env.API_URL + 'auth/user', {
				headers: headers
			})
			.pipe(
				tap(user => {
					return user;
				})
			)
	}

	getToken() {
		return this.storage.getItem('token').then(
			data => {
				this.token = data;
				if (this.token != null) {
					this.isLoggedIn = true;
				} else {
					this.isLoggedIn = false;
				}
			},
			error => {
				this.token = null;
				this.isLoggedIn = false;
			}
		);
	}
}