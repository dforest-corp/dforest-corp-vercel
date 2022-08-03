import {NextApiRequest, NextApiResponse} from "next";
import * as crypto from "crypto";
import {Webhook} from "@/types/cmsType";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const expectedSignature = crypto
    .createHmac('sha256', `${process.env.MICROCMS_SECRET}`)
    .update(JSON.stringify(req.body))
    .digest('hex');

  const signature = `${req.headers['x-microcms-signature']}`;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid signature.');
  }

  const data: Webhook = req.body

  if (data.id === process.env.COMPANY_POST_ID) {
    await res.revalidate('/company')
    return res.json({revalidated: true})
  }
  if (data.id === process.env.WORKS_POST_ID) {
    await res.revalidate('/works')
    return res.json({revalidated: true})
  }
  await res.revalidate('/')
  await res.revalidate(`/news/${data.id}`)
  return res.json({revalidated: true})
}