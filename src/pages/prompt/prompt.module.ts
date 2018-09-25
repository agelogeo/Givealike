import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromptPage } from './prompt';

@NgModule({
  declarations: [
    PromptPage,
  ],
  imports: [
    IonicPageModule.forChild(PromptPage),
  ],
})
export class PromptPageModule {}
