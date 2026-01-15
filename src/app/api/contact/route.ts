import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@softacademy.ge'

    // Send notification to admin
    await sendEmail({
      to: adminEmail,
      subject: `[Contact Form] შეტყობინება - ${data.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ახალი შეტყობინება</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">საკონტაქტო ფორმიდან</p>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #64748b;">სახელი:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
                  ${data.name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #64748b;">ელ-ფოსტა:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${data.email}" style="color: #2563EB; text-decoration: none;">${data.email}</a>
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <strong style="color: #64748b; display: block; margin-bottom: 8px;">შეტყობინება:</strong>
              <div style="background: #f8fafc; border-radius: 8px; padding: 16px; color: #1e293b; line-height: 1.6;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <a href="mailto:${data.email}?subject=Re: SoftAcademy - თქვენი შეტყობინება"
                 style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                        color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                პასუხის გაგზავნა
              </a>
            </div>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
            ეს შეტყობინება გამოგზავნილია SoftAcademy-ს საკონტაქტო ფორმიდან
          </p>
        </div>
      `,
    })

    // Send confirmation to user
    await sendEmail({
      to: data.email,
      subject: 'მადლობა დაკავშირებისთვის - SoftAcademy',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">მადლობა!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">თქვენი შეტყობინება მიღებულია</p>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              გამარჯობა, <strong>${data.name}</strong>!
            </p>

            <p style="color: #64748b; line-height: 1.6; margin: 0 0 20px;">
              მადლობა, რომ დაგვიკავშირდით. თქვენი შეტყობინება მიღებულია და ჩვენი გუნდი
              განიხილავს მას უმოკლეს ვადაში. როგორც წესი, ჩვენ ვპასუხობთ 24 საათის განმავლობაში.
            </p>

            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <strong style="color: #64748b; display: block; margin-bottom: 8px;">თქვენი შეტყობინება:</strong>
              <p style="color: #1e293b; margin: 0; line-height: 1.6;">
                ${data.message.replace(/\n/g, '<br>')}
              </p>
            </div>

            <p style="color: #64748b; font-size: 14px; margin: 0;">
              გაქვთ სასწრაფო კითხვა? დაგვიკავშირდით პირდაპირ:<br>
              <a href="tel:+995555123456" style="color: #2563EB; text-decoration: none;">+995 555 123 456</a>
            </p>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
            &copy; ${new Date().getFullYear()} SoftAcademy. ყველა უფლება დაცულია.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
