function toPdf() {
    document.getElementById('print-button').hidden = true;
    window.print();
    document.getElementById('print-button').hidden = false;

}
