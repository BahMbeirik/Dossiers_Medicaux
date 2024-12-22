import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService, Patient } from './../services/patient.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent {
  patient: Patient = {
    numero_identite: '',
    nom: '',
    prenom: '',
    age: 0,
    numero_telephone: ''
  };

  constructor(private patientService: PatientService, private router: Router) {}

  addPatient(): void {
    // التأكد من أن جميع الحقول المملوءة ليست فارغة
    if (!this.patient.numero_identite || !this.patient.nom || !this.patient.prenom || !this.patient.numero_telephone) {
      alert('Please fill in all required fields.');
      return;  // لا ترسل الطلب إذا كانت بعض الحقول فارغة
    }
  
    console.log('Data sent to API:', this.patient);
    this.patientService.addPatient(this.patient).subscribe({
      
      next: (response) => {
        console.log('Patient added successfully:', response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
        
      }
    });
  }
  
  

}
