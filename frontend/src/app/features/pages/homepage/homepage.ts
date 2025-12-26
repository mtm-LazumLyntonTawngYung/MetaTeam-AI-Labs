import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, TranslateModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {

}
