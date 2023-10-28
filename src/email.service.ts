import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { createForm } from '../emails/template';

@Injectable()
export class EmailService {
	public async sendEmail(username: string, email: string, code: number) {
		console.log(email, code);
		await this.mailService.sendMail({
			from: '"No Reply" <example@example.com>',
			subject: '',
			to: email,
			template: createForm(code, username), // Replace with the actual path or name of the template file
			context: {
				code,
				username,
				email,
			},
			html: createForm(code, username), // Pass the rendered template as HTML content
		});
	}

	public generateCode() {
		return Math.floor(100000 + Math.random() * 900000);
	}

	constructor(private mailService: MailerService) {}
}
