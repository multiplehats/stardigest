import { SENDGRID_API_KEY } from '$env/static/private';
import SendgridService from '$lib/services/sendgrid/sendgrid.service';

export const sendgrid = new SendgridService(SENDGRID_API_KEY);
