import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  // Nếu cùng ngày => hiển thị giờ
  // Khác ngày => Hiển thị ngày giờ
  transform(value: any, ...args: any[]): any {


    const currentDate = new Date();
    const dateCompare = moment(value).toDate();

    if (currentDate.getDay() == dateCompare.getDay() &&
      currentDate.getMonth() == dateCompare.getMonth() &&
      currentDate.getFullYear() == dateCompare.getFullYear()
    ) {
      return moment(value).format("hh:mm A");;
    }

    return moment(value).format("MM/dd hh:mm A");;
  }

}
