import { ConsoleLogger, Injectable } from '@nestjs/common';
const latex = require('node-latex')
const fs = require('fs')
const Mustache = require('mustache')
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class AppService {

  async convertTexToPdf() {

    const input = fs.createReadStream(`/nodetar/output.tex`)
    const pdf = latex(input)
    try {
      const chunks = [];
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        let buffer: Buffer;
        pdf.on('data', function (chunk) {
          chunks.push(chunk);
        });
        pdf.on('end', function () {
          buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        pdf.on('error', reject);
      });
      
      return buffer.toString('base64');
    } catch (error) {
      console.log("error creando el buffer")
      throw error;
    }
  }
  async mustacheLaTex( inputFields: any ) {

    let objInputFields = JSON.parse(inputFields.buffer.toString());

    let fields = {
      nombre: "Maximiliano"
    };
    //console.log(fields)

    var customTags = [ '<%', '%>' ];
    //let output = Mustache.render("{{title}} spends {{calc}}", view);  //\\\\<%%>
    let LaTex = Mustache.render(`\\documentclass[10pt]{article} 
    \\usepackage[utf8]{inputenc}
    \\usepackage[T1]{fontenc}
    \\usepackage{uarial}
    \\renewcommand\\familydefault{\\sfdefault} 
    \\usepackage{ragged2e}
    \\usepackage{tabularx}
    \\usepackage{geometry}
     \\geometry{
        letterpaper,
        top=14.5mm,
        right=12.3mm,
        left=12.3mm,
        bottom=13.19mm,
        includefoot=true
        }
     
    \\begin{document}
    \\newgeometry{
        top=14.5mm,
        right=12.3mm,
        left=12.3mm,
        bottom=13.19mm,
        includeheadfoot=true,
        }
    \\pagestyle{empty}
    
    \\begin{center}
    {\\fontsize{15}{15} \\selectfont \\textbf{CONTRATO}}
    \\end{center}
    \\vspace{15pt}
    \\begin{center}
    {\\fontsize{20}{20} \\selectfont \\textbf{COMPRA VENTA (AFCCPN)}}
    \\end{center}
        
    \\begin{justify}
    \\textbf{PRIMERO}: El vendedor declara que el vehículo objeto de la presente compraventa no se encuentra afecto a
    gravámenes, prohibiciones, embargos ni litigios así como tampoco a multas y/o sanciones derivadas de delitos,
    cuasidelitos e infracciones que pudieren haberse cometido a la fecha de la presente compraventa. Asimismo, declara
    que el vehículo no registra deudas de ninguna naturaleza derivadas de su circulación por la vías concesionadas a la
    fecha de la presente compraventa. Sin perjuicio de lo anterior, y para el improbable evento que con posterioridad a la
    suscripción del presente contrato se recibiesen multas, sanciones y/o deudas originadas con anterioridad a la fecha de
    la presente compraventa, el vendedor se obliga a pagarlas y/o a reembolsarle al comprador \\textbf{<%nombre%>} cualquier perjuicio derivado de las mismas que pudiere afectarle, dentro de las 24 horas
    siguientes a la fecha en que \\textbf{<%nombre%>} le haya comunicado tal circunstancia.
    Conforme lo anterior, el vendedor confiere mandato irrevocable al comprador \\textbf{<%nombre%>} en los términos previstos en el articulo 241 del Código de Comercio, para que en su nombre y representación
    cobre y/o pague todas las multas, gastos, consumos de TAG y cuentas devengadas y/o cursadas con anterioridad a la
    fecha del presente contrato de compraventa, con expresa obligación rendir cuenta, obligándose a su vez a proveer los
    fondos necesarios para su pago y/o a efectuar su reembolso dentro de las 24 horas contadas desde la solicitud
    efectuada por el Comprador.
    \\end{justify}
    \\end{document}
    `, fields,{},customTags);
    //console.log(LaTex)
    fs.writeFileSync(`/nodetar/output.tex`, LaTex)
    return await this.convertTexToPdf();
  }
}

