import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class ConfigService {
	API_URL = 'http://localhost:8000/api/auth/';
	
	constructor() { 

	}
}