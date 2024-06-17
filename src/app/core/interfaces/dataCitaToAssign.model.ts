export class dataCitaToAssign {
  constructor(
    public appointment = {
      value: '',
      text: '',
      brand: '',
      face_to_face: '',
    },
    public typeAppointment = '',

    public subappointment = {
      value: '',
      text: '',
      company_owner: '',
      procedure: '',
    },

    public ips = {
      value: '',
      text: '',
    },

    public sede?,
    public speciality?,
    public person: any = '',
    public timeDuration = '',
    public appointmentId?,
    public subappointmentId?,
    public ipsId?,
    public currentAppointment?,
    public contractId?,
  ) {}

  public resetData() {
    this.speciality = null;
    this.person = null;
    this.appointmentId = null;
    this.subappointmentId = null;
    this.currentAppointment = null;
  }
}
