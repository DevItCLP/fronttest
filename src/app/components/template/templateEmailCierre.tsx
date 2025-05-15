import imgen from "../../../../public/images/logos/logo.png";

export function generateHtmlCloseTemplate(proceso: string, cerrado_por: string, date_time: string, idRegistro: string) {
  return `
 
<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Simple Transactional Email</title>
    <style media="all" type="text/css">

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Varela+Round&display=swap');


    /* -------------------------------------
    GLOBAL RESETS
------------------------------------- */
    
    body {
      font-family: Varela Round, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 13px;
      line-height: 1.3;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    table td {
      font-family: Varela Round, sans-serif;
      font-size: 13px;
      vertical-align: top;
    }
    /* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
    
    body {
      background-color: #f4f5f6;
      margin: 0;
      padding: 0;
    }
    
    .body {
      background-color: #f4f5f6;
      width: 100%;
    }
    
    .container {
      margin: 0 auto !important;
      max-width: 600px;
      padding: 0;
      padding-top: 24px;
      width: 600px;
    }
    
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 600px;
      padding: 0;
    }
    /* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
    
    .main {
      background: #ffffff;
      border: 1px solid #eaebed;
      border-radius: 16px;
      width: 100%;
    }
    
    .wrapper {
      box-sizing: border-box;
      padding: 24px;
    }
    
    .footer {
      clear: both;
      padding-top: 24px;
      text-align: center;
      width: 100%;
    }
    
    .footer td,
    .footer p,
    .footer span,
    .footer a {
      color: #9a9ea6;
      font-size: 12px;
      text-align: center;
    }
    /* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
    
    p {
      font-family: Varela Round, sans-serif;
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 16px;
    }
    
    a {
      color: #0867ec;
      text-decoration: underline;
    }
    /* -------------------------------------
    BUTTONS
------------------------------------- */
    
    .btn {
      box-sizing: border-box;
      min-width: 100% !important;
      width: 100%;
    }
    
    .btn > tbody > tr > td {
      padding-bottom: 16px;
    }
    
    .btn table {
      width: auto;
    }
    
    .btn table td {
      background-color: #ffffff;
      border-radius: 4px;
      text-align: center;
    }
    
    .btn a {
      background-color: #ffffff;
      border: solid 2px #0867ec;
      border-radius: 4px;
      box-sizing: border-box;
      color: #0867ec;
      cursor: pointer;
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      margin: 0;
      padding: 12px 24px;
      text-decoration: none;
      text-transform: capitalize;
    }
    
    .btn-primary table td {
      background-color: #0867ec;
    }
    
    .btn-primary a {
      background-color: #0867ec;
      border-color: #0867ec;
      color: #ffffff;
    }
    
    @media all {
      .btn-primary table td:hover {
        background-color: #ec0867 !important;
      }
      .btn-primary a:hover {
        background-color: #ec0867 !important;
        border-color: #ec0867 !important;
      }
    }
    
    /* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
    
    .last {
      margin-bottom: 0;
    }
    
    .first {
      margin-top: 0;
    }
    
    .align-center {
      text-align: center;
    }
    
    .align-right {
      text-align: right;
    }
    
    .align-left {
      text-align: left;
    }
    
    .text-link {
      color: #0867ec !important;
      text-decoration: underline !important;
    }
    
    .clear {
      clear: both;
    }
    
    .mt0 {
      margin-top: 0;
    }
    
    .mb0 {
      margin-bottom: 0;
    }
    
    .preheader {
      color: transparent;
      display: none;
      height: 0;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      mso-hide: all;
      visibility: hidden;
      width: 0;
    }
    
    .powered-by a {
      text-decoration: none;
    }
    
    /* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
    
    @media only screen and (max-width: 640px) {
      .main p,
      .main td,
      .main span {
        font-size: 16px !important;
      }
      .wrapper {
        padding: 8px !important;
      }
      .content {
        padding: 0 !important;
      }
      .container {
        padding: 0 !important;
        padding-top: 8px !important;
        width: 100% !important;
      }
      .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      .btn table {
        max-width: 100% !important;
        width: 100% !important;
      }
      .btn a {
        font-size: 16px !important;
        max-width: 100% !important;
        width: 100% !important;
      }
    }
    /* -------------------------------------
    PRESERVE THESE STYLES IN THE HEAD
------------------------------------- */
    
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
    }
    </style>
  </head>
  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">Zip Architecture Management Innovation</span>
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
              
  
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                <!--
                  <div class="header" style="text-align: center;">
                    <img src=${imgen} alt="ZAMICLP" width="150" height="150" />
                  </div> -->


                  <div class="header" style="text-align: center;">
                    <h2>Nuevo Cierre de Observación</h2>
                  </div>

                  <p>Hola, </p>
                  <p>Se ha cerrado una observación desde la plataforma web <b>ZAMICLP</b>,
                    a continuación te indicamos los datos del registro:</p>
                    <strong><hr></strong>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td align="left">
                            <strong>Proceso: </strong>
                          </td>
                          <td align="left">
                            <strong>${proceso} </strong>
                          </td>
                        </tr>
                        
                        <tr>
                          <td align="left">
                            <strong>ID Proceso: </strong>
                          </td>
                          <td align="left">
                            <strong>${idRegistro} </strong>
                          </td>
                        </tr>
                        
                        
                        <tr>
                          <td align="left">
                            <strong>Cerrado por: </strong>
                          </td>
                          <td align="left">
                            <strong>${cerrado_por}</strong>
                          </td>
                        </tr>
                     
                        <tr>
                          <td align="left">
                            <strong>Fecha y hora: </strong>
                          </td>
                          <td align="left">
                            <strong>${date_time}</strong>
                          </td>
                        </tr>


                      </tbody>
                    </table>
                    <strong><hr></strong>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary btn-sm">
                    <tbody>
                      <tr>
                        <td align="left">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                              <tr>
                                <td> <a href="http://go-zami.com" target="_blank">Revisar</a> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  Este es un correo automático, por favor no conteste este correo<br>
                  <img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                  color: #000000;"
                    alt="T" title="Planeta"
                    width="20" height="20"
                    src="http://sistema.clpcatering.com/sistema/images/hoja.png">No imprimas este correo si no es necesario.
                      </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
              </table>

            <!-- START FOOTER -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="font-size: 12px;">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">Catering Las Peñas Cia. Ltda., Zamora Ch. - Los Encuentros- Ecuador.</span>
                     <br> Correo enviado atráves del sistema ZAMI. <br>
                    <br> Zip Architecture Management Innovation.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                    Powered by <a href="https://go-zami.com" style="color: #999999;  text-align: center; text-decoration: none;">Departamento
                      de TIC's</a>.
                  </td>
                </tr>
              </table>
            </div>

           


            <!-- END FOOTER -->
            
<!-- END CENTERED WHITE CONTAINER --></div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
    `;
}
