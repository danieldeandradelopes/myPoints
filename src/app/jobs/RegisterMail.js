// import { format, parse } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMain {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Cadastro App My Points',
      template: 'register_user',
      context: {
        user: user.name,
        email: user.email,
      },
    });
  }
}

export default new CancellationMain();
