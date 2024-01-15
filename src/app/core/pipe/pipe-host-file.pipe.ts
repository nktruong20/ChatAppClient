import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'pipeHostFile'
})
export class PipeHostFilePipe implements PipeTransform {
  // Nếu ảnh dạng base64 => giữ nguyên base6 hiển thị
  // Ngược lại => Lấy ảnh qua server
  transform(value: any, ...args: any[]): any {
    if (value == null || value.indexOf("data:image/png;base64,") >= 0)
      return value;
    return environment.apiUrl + "img?key=" + value;
  }

}
