import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '@carconfig/auth';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let login: jasmine.Spy;

  beforeEach(async () => {
    login = jasmine.createSpy('login').and.returnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: { login } }],
    })
      .overrideComponent(LoginComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
  });

  it('does not submit invalid credentials and marks fields as touched', () => {
    fixture.componentInstance.onLogin();

    expect(login).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.controls.email.touched).toBeTrue();
    expect(fixture.componentInstance.form.controls.password.touched).toBeTrue();
  });

  it('submits valid email and password to the authentication service', () => {
    fixture.componentInstance.form.setValue({ email: 'demo@example.com', password: 'secret' });

    fixture.componentInstance.onLogin();

    expect(login).toHaveBeenCalledOnceWith('demo@example.com', 'secret');
  });
});
