import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Patient {
  id?: number;
  numero_identite: string;
  nom: string;
  prenom: string;
  age: number;
  numero_telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/auth/patients/`;

  constructor(private http: HttpClient) {}

  /**
   * إعداد الهيدرز مع توكن المصادقة
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    console.log('Access Token:', token); 
    if (!token) {
      throw new Error('Access token is missing.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // إرسال التوكن هنا
    });
  }
  

  /**
   * جلب جميع المرضى
   */
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * جلب مريض حسب المعرف
   */
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  

  /**
   * إضافة مريض جديد
   */
  addPatient(patient: Patient): Observable<Patient> {
    console.log('Access Token:', localStorage.getItem('access_token'));
    return this.http.post<Patient>(this.apiUrl, patient, { headers: this.getHeaders() }).pipe(
        catchError(this.handleError)
    );
}



  /**
   * تعديل بيانات مريض
   */
  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}${patient.id}/`, patient, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * حذف مريض
   */
  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * معالجة الأخطاء
   */
  private handleError(error: any): Observable<never> {
    let errorMsg: string;
    if (error.status === 400) {
      errorMsg = 'Invalid data submitted.';
    } else if (error.status === 401) {
      errorMsg = 'Unauthorized access. Please log in again.';
    } else {
      errorMsg = 'Something went wrong. Please try again.';
    }
    console.error('PatientService Error:', error);
    return throwError(() => new Error(errorMsg));
  }
  

}
