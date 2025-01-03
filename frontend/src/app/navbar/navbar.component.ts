import { Component } from '@angular/core';

//navbar
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isLoggedIn = false;

  constructor(private router: Router ,private authService: AuthService) {
    this.isLoggedIn = !!localStorage.getItem('access_token');
  }

  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }
  

}
