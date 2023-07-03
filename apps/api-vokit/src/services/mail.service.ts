import { HttpResponseError } from '../modules/http-response-error';
import { PreSignedTypeEnum } from 'vokit_core';
import { Service } from '../core';
import { createTransport } from 'nodemailer';

class MailService extends Service {
  public sender = 'Vokit <no-reply@vokit.fr>';

  private getMailContent(link: string, type: PreSignedTypeEnum) {
    switch (type) {
      case PreSignedTypeEnum.CREATE_ACCOUNT: {
        return {
          subject: 'VOKIT - Création de compte',
          html: `<div style="background-color: #181526; margin: 0; padding: 0">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="background-color: #181526"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="m_-7192359969736224378row-content m_-7192359969736224378stack"
                            role="presentation"
                            style="color: #000000; width: 600px"
                            width="600"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="m_-7192359969736224378column m_-7192359969736224378column-1"
                                  style="
                                    font-weight: 400;
                                    text-align: left;
                                    vertical-align: top;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    border-top: 0px;
                                    border-right: 0px;
                                    border-bottom: 0px;
                                    border-left: 0px;
                                  "
                                  width="100%"
                                >
                                  <table
                                    border="0"
                                    cellpadding="5"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div
                                            style="
                                              margin: 0;
                                              color: #181526;
                                              direction: ltr;
                                              font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              font-size: 38px;
                                              font-weight: 700;
                                              letter-spacing: normal;
                                              line-height: 120%;
                                              text-align: center;
                                              margin-top: 0;
                                              margin-bottom: 0;
                                              display: flex;
                                              justify-content: center;
                                              align-items: center;
                                              margin-top: 10px;
                                            "
                                          >
                                            <img
                                              src="https://storage-staging-api.abyss-project.fr/api/user-application-file/file/download/public-access/d14188f6-68e2-4149-bd65-62830d57c71d"
                                              alt="Logo Vokit"
                                              style="height: 50px; margin: auto"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="m_-7192359969736224378row-2"
                    role="presentation"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="m_-7192359969736224378row-content m_-7192359969736224378stack"
                            role="presentation"
                            style="color: #000000; width: 600px"
                            width="600"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="m_-7192359969736224378column m_-7192359969736224378column-1"
                                  style="
                                    font-weight: 400;
                                    text-align: left;
                                    vertical-align: top;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    border-top: 0px;
                                    border-right: 0px;
                                    border-bottom: 0px;
                                    border-left: 0px;
                                  "
                                  width="100%"
                                >
                                  <table
                                    border="0"
                                    cellpadding="10"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div align="center">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="
                                                      font-size: 1px;
                                                      line-height: 1px;
                                                      border-top: 2px solid #3b99f1;
                                                    "
                                                  >
                                                    <span></span>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="15"
                                    cellspacing="0"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div style="font-family: Arial, sans-serif">
                                            <div
                                              style="
                                                font-size: 12px;
                                                font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                                                color: #a4aab6;
                                                line-height: 1.2;
                                              "
                                            >
                                              <p style="margin: 0; font-size: 16px; text-align: center">
                                                <strong>
                                                  <span style="font-size: 22px">Création de compte</span>
                                                </strong>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="10"
                                    cellspacing="0"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div style="font-family: sans-serif">
                                            <div
                                              style="
                                                font-size: 12px;
                                                color: #a4aab6;
                                                line-height: 1.2;
                                                font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              "
                                            >
                                              <p style="margin: 0; font-size: 14px; text-align: center">
                                                <span style="font-size: 14px"
                                                  >Cliquez sur le bouton ci-dessous pour valider votre adresse e-mail. Ce lien est valide pendant une semaine.</span
                                                >
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                          <div style="display: flex;
                                          justify-content: center;
                                          margin: 10px;">
                                            <a
                                              href="${link}"
                                              style="
                                              margin: auto;
                                                text-decoration: none;
                                                display: inline-block;
                                                color: #ffffff;
                                                background-color: #3b99f1;
                                                width: auto;
                                                border-top: 0px solid transparent;
                                                font-weight: 400;
                                                border-right: 0px solid transparent;
                                                border-bottom: 0px solid transparent;
                                                border-left: 0px solid transparent;
                                                padding-top: 5px;
                                                padding-bottom: 5px;
                                                font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                                font-size: 16px;
                                                text-align: center;
                                                word-break: keep-all;
                                              "
                                              target="_blank"
                                            >
                                              <span
                                                style="
                                                  padding-left: 20px;
                                                  padding-right: 20px;
                                                  font-size: 16px;
                                                  display: inline-block;
                                                  letter-spacing: normal;
                                                "
                                              >
                                                <span
                                                  dir="ltr"
                                                  style="
                                                    margin: 0;
                                                    word-break: break-word;
                                                    line-height: 32px;
                                                  "
                                                  >Valider mon adresse e-mail</span
                                                >
                                              </span>
                                            </a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="m_-7192359969736224378paragraph_block"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad" style="padding-top: 15px">
                                          <div
                                            style="
                                              color: #a4aab6;
                                              direction: ltr;
                                              font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              font-size: 10px;
                                              font-weight: 400;
                                              letter-spacing: 0px;
                                              line-height: 120%;
                                              text-align: center;
                                            "
                                          >
                                            <p style="margin: 0">
                                              Vous recevez cet e-mail car vous avez créé un compte sur
                                              <a
                                                style="
                                                  text-decoration: none;
                                                  color: #3b99f1;
                                                  font-weight: 600;
                                                "
                                                href="https://app.vokit.fr"
                                                target="_blank"
                                                >Vokit</a
                                              >
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        `,
        };
      }
      case PreSignedTypeEnum.RENEW_PASSWORD:
        return {
          subject: 'VOKIT - Réinitialisation du mot de passe',
          html: `<div style="background-color: #181526; margin: 0; padding: 0">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="background-color: #181526"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="m_-7192359969736224378row-content m_-7192359969736224378stack"
                            role="presentation"
                            style="color: #000000; width: 600px"
                            width="600"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="m_-7192359969736224378column m_-7192359969736224378column-1"
                                  style="
                                    font-weight: 400;
                                    text-align: left;
                                    vertical-align: top;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    border-top: 0px;
                                    border-right: 0px;
                                    border-bottom: 0px;
                                    border-left: 0px;
                                  "
                                  width="100%"
                                >
                                  <table
                                    border="0"
                                    cellpadding="5"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div
                                            style="
                                              margin: 0;
                                              color: #181526;
                                              direction: ltr;
                                              font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              font-size: 38px;
                                              font-weight: 700;
                                              letter-spacing: normal;
                                              line-height: 120%;
                                              text-align: center;
                                              margin-top: 0;
                                              margin-bottom: 0;
                                              display: flex;
                                              justify-content: center;
                                              align-items: center;
                                              margin-top: 10px;
                                            "
                                          >
                                            <img
                                              src="https://storage-staging-api.abyss-project.fr/api/user-application-file/file/download/public-access/d14188f6-68e2-4149-bd65-62830d57c71d"
                                              alt="Logo Vokit"
                                              style="height: 50px; margin: auto"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="m_-7192359969736224378row-2"
                    role="presentation"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="m_-7192359969736224378row-content m_-7192359969736224378stack"
                            role="presentation"
                            style="color: #000000; width: 600px"
                            width="600"
                          >
                            <tbody>
                              <tr>
                                <td
                                  class="m_-7192359969736224378column m_-7192359969736224378column-1"
                                  style="
                                    font-weight: 400;
                                    text-align: left;
                                    vertical-align: top;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    border-top: 0px;
                                    border-right: 0px;
                                    border-bottom: 0px;
                                    border-left: 0px;
                                  "
                                  width="100%"
                                >
                                  <table
                                    border="0"
                                    cellpadding="10"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div align="center">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              width="100%"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="
                                                      font-size: 1px;
                                                      line-height: 1px;
                                                      border-top: 2px solid #3b99f1;
                                                    "
                                                  >
                                                    <span></span>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="15"
                                    cellspacing="0"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div style="font-family: Arial, sans-serif">
                                            <div
                                              style="
                                                font-size: 12px;
                                                font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                                                color: #a4aab6;
                                                line-height: 1.2;
                                              "
                                            >
                                              <p style="margin: 0; font-size: 16px; text-align: center">
                                                <strong>
                                                  <span style="font-size: 22px">Mot de passe oublié ?</span>
                                                </strong>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="10"
                                    cellspacing="0"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad">
                                          <div style="font-family: sans-serif">
                                            <div
                                              style="
                                                font-size: 12px;
                                                color: #a4aab6;
                                                line-height: 1.2;
                                                font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              "
                                            >
                                              <p style="margin: 0; font-size: 14px; text-align: center">
                                                <span style="font-size: 14px"
                                                  >Appuyez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien est valide pendant 24 heures.</span
                                                >
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                          <div style="display: flex;
                                          justify-content: center;
                                          margin: 10px;">
                                            <a
                                              href="${link}"
                                              style="
                                              margin: auto;
                                                text-decoration: none;
                                                display: inline-block;
                                                color: #ffffff;
                                                background-color: #3b99f1;
                                                width: auto;
                                                border-top: 0px solid transparent;
                                                font-weight: 400;
                                                border-right: 0px solid transparent;
                                                border-bottom: 0px solid transparent;
                                                border-left: 0px solid transparent;
                                                padding-top: 5px;
                                                padding-bottom: 5px;
                                                font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                                font-size: 16px;
                                                text-align: center;
                                                word-break: keep-all;
                                              "
                                              target="_blank"
                                            >
                                              <span
                                                style="
                                                  padding-left: 20px;
                                                  padding-right: 20px;
                                                  font-size: 16px;
                                                  display: inline-block;
                                                  letter-spacing: normal;
                                                "
                                              >
                                                <span
                                                  dir="ltr"
                                                  style="
                                                    margin: 0;
                                                    word-break: break-word;
                                                    line-height: 32px;
                                                  "
                                                  >Réinitialiser le mot de passe</span
                                                >
                                              </span>
                                            </a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          class="m_-7192359969736224378pad"
                                          style="
                                            padding-bottom: 10px;
                                            padding-left: 10px;
                                            padding-right: 10px;
                                            padding-top: 25px;
                                          "
                                        >
                                          <div style="font-family: sans-serif">
                                            <div
                                              style="
                                                font-size: 12px;
                                                color: #a4aab6;
                                                line-height: 1.2;
                                                font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              "
                                            >
                                              <p style="margin: 0; font-size: 14px; text-align: center">
                                                Si vous n'avez pas demandé de réinitialisation de mot de
                                                passe, vous pouvez ignorer cet e-mail.
                                              </p>
                                              <p style="margin: 0; font-size: 14px; text-align: center">
                                                Votre mot de passe ne sera pas modifié
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="m_-7192359969736224378paragraph_block"
                                    role="presentation"
                                    style="word-break: break-word"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td class="m_-7192359969736224378pad" style="padding-top: 15px">
                                          <div
                                            style="
                                              color: #a4aab6;
                                              direction: ltr;
                                              font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
                                              font-size: 10px;
                                              font-weight: 400;
                                              letter-spacing: 0px;
                                              line-height: 120%;
                                              text-align: center;
                                            "
                                          >
                                            <p style="margin: 0">
                                              Vous recevez cet e-mail car vous crééez un compte sur
                                              <a
                                                style="
                                                  text-decoration: none;
                                                  color: #3b99f1;
                                                  font-weight: 600;
                                                "
                                                href="https://app.vokit.fr"
                                                target="_blank"
                                                >Vokit</a
                                              >
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        `,
        };
      default: {
        return null;
      }
    }
  }

  public async sendMail(mail: string, type: PreSignedTypeEnum, link: string): Promise<void> {
    this.logger.log(`Sending **${PreSignedTypeEnum[type]}** mail`);

    const mailContent = this.getMailContent(link, type);

    if (!mailContent) return;

    try {
      await createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      }).sendMail({
        from: this.sender,
        to: mail,
        subject: mailContent.subject,
        html: mailContent.html,
      });
    } catch (e) {
      console.log(e);
      throw HttpResponseError.createInternalServerError();
    }
  }
}
export default new MailService();
