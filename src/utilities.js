import moment from "moment";

export const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}


// get file type form file name
export const getFileType = (fileName) => {
    // Get the last portion of the file name after the last dot (.)
    const fileExtension = fileName.split('.').pop();
    return fileExtension.toLowerCase(); // Convert to lowercase for consistency
}

// discussion date beautify
export const formatDate = (date) => {
    // date = moment(date);
    const inputDate = moment(date, 'YYYY-MM-DD')
    const currentDate = moment();

    if (inputDate.isSame(currentDate, 'day')) {
        return 'Today';
    }

    if (currentDate.diff(inputDate, 'days') < 7) {
        return inputDate.format('dddd'); // Return day name
    } else {
        return inputDate.format('ll'); // Return full date
    }

}