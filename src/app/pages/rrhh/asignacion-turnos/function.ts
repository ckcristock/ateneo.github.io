export const functionsSemana = {
  changeColor(event) {
    if (this.turno === 'seleccione') {
      this.withColor = '#9da4ad';
      this.changed.emit(this.turno);
      return;
    }
    if (this.turno === '0') {
      this.changed.emit(this.turno);
      this.withColor = '#000';
      return;
    }

    let turn = this.turnos.find((turno) => {
      return turno.id == event;
    });
    this.withColor = turn.color;
  },
};
