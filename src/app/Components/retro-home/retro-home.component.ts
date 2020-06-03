import { Component, OnInit, Output } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-retro-home',
  templateUrl: './retro-home.component.html',
  styleUrls: ['./retro-home.component.css']
})
export class RetroHomeComponent implements OnInit {

  constructor(private route: Router) { }
  @Output() retroStarted = false;
  ngOnInit() {
  }

  onRetroStarted() {

    this.retroStarted = true;
    this.route.navigate(['/retro']);
  }

}
