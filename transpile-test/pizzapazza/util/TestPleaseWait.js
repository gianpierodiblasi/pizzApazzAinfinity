/**
 * @author gianpiero.diblasi
 */
class TestPleaseWait extends JSFrame {

   value = 0;

  constructor() {
    super();
    let button = new JSButton();
    button.setText("TEST");
    button.addActionListener(event => Z4UI.pleaseWait(button, true, true, false, true, "", () => this.iterate()));
    let p = new JSPanel();
    p.add(button, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }

   iterate() {
    for (let i = 0; i < 200; i++) {
      console.log(i);
    }
    Z4UI.setPleaseWaitProgressBarValue(this.value++);
    if (this.value === 100) {
      this.value = 0;
      Z4UI.pleaseWaitCompleted();
    } else {
      Z4UI.pleaseWaitAdvanced(() => this.iterate());
    }
  }
}
