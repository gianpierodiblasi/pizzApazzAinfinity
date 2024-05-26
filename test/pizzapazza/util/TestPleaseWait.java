package pizzapazza.util;

import static def.dom.Globals.console;
import javascript.awt.BorderLayout;
import javascript.swing.JSButton;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestPleaseWait extends JSFrame {

  private int value = 0;

  public TestPleaseWait() {
    super();

    JSButton button = new JSButton();
    button.setText("TEST");

    button.addActionListener(event -> {
      Z4UI.pleaseWait(button, true, true, false, true, "", () -> {
      }, () -> {
        this.iterate();
        return null;
      }, obj -> {
      });
    });

    JSPanel p = new JSPanel();
    p.add(button, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }

  private void iterate() {
    for (int i = 0; i < 200; i++) {
      console.log(i);
    }

    Z4UI.setPleaseWaitProgressBarValue(this.value++);
    if (this.value == 100) {
      this.value = 0;
      Z4UI.pleaseWaitCompleted();
    } else {
      Z4UI.pleaseWaitAdvanced(() -> this.iterate());
    }
  }
}
