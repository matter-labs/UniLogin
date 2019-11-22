import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';
import GasModePage from './GasModePage';

export default class TransferPage {
  constructor(
    private appWrapper: ReactWrapper,
    private gasModePage: GasModePage,
  ) {}

  async chooseCurrency(currency: string) {
    await waitForUI(this.appWrapper, () => this.appWrapper.find('button.currency-accordion-item').length !== 0);
    this.appWrapper.find('button.currency-accordion-btn').simulate('click');
    const items = this.appWrapper.find('button.currency-accordion-item');
    items.filterWhere(item => item.text().includes(currency)).first().simulate('click');
  }

  transfer() {
    this.appWrapper.find('#send-button').first().simulate('click');
  }

  enterTransferAmount(amount: string) {
    const amountInput = this.appWrapper.find('input#amount-eth');
    amountInput.simulate('change', {target: {value: amount}});
    this.appWrapper.find('#select-recipient').simulate('click');
  }

  enterRecipient(address: string) {
    const addressInput = this.appWrapper.find('input#input-recipient');
    addressInput.simulate('change', {target: {value: address}});
  }

  getErrorMessage() {
    this.appWrapper.update();
    return this.appWrapper.find('.error-message').text();
  }

  selectGasMode() {
    return this.gasModePage.selectGasMode();
  }

  waitForGasMode() {
    return this.gasModePage.waitForGasMode();
  }
}
