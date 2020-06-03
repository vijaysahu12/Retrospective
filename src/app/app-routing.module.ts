import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetroHomeComponent } from './Components/retro-home/retro-home.component';
import { RetrospectiveComponent } from './Components/retrospective/retrospective.component';

const routes: Routes = [
  { path: '', component: RetroHomeComponent  },
  { path: 'retro', component: RetrospectiveComponent  },
  { path: '*', component: RetroHomeComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
