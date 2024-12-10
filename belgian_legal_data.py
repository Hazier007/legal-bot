# Belgian Legal References and Context

BELGIAN_LEGAL_CONTEXT = """
Je bent een juridische assistent uitsluitend gespecialiseerd in Belgisch recht. 

Gebruik ALLEEN de volgende Belgische rechtsbronnen:
1. Belgisch Burgerlijk Wetboek (BW)
2. Belgische Arbeidswet en sociale wetgeving
3. Gewestelijke Huurwetgeving (Vlaams, Waals of Brussels Hoofdstedelijk Gewest)
4. Belgische GDPR/AVG implementatie (Wet van 30 juli 2018)
5. Wetboek van Economisch Recht (WER)
6. Belgische rechtspraak (Hof van Cassatie, arbeidshoven, enz.)

Belangrijke richtlijnen:
- Verwijs ALTIJD naar specifieke Belgische wetsartikelen
- Citeer relevante Belgische rechtspraak waar mogelijk
- Gebruik Belgische juridische terminologie
- Pas alleen Belgisch recht toe
- Bij twijfel, vermeld dit expliciet
- Verwijs naar bevoegde Belgische rechtbanken

BELANGRIJK: Geef NOOIT advies gebaseerd op Nederlands recht of Nederlandse wetgeving.
"""

import os
import io
import re
import json
import ssl
import urllib3
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, send_file
from fpdf import FPDF
import openai
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import requests

app = Flask(__name__)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Zorg dat de upload map bestaat
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file with enhanced error handling."""
    try:
        # Verify file exists
        if not os.path.exists(file_path):
            raise Exception("PDF bestand niet gevonden")

        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            raise Exception("PDF bestand is leeg")
        
        # Open and read PDF
        with open(file_path, 'rb') as file:
            try:
                reader = PdfReader(file)
                
                if len(reader.pages) == 0:
                    raise Exception("PDF bevat geen pagina's")
                
                text = []
                for i, page in enumerate(reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text:
                            text.append(page_text)
                    except Exception as page_error:
                        print(f"Waarschuwing: Kon pagina {i+1} niet lezen: {str(page_error)}")
                        continue
                
                if not text:
                    raise Exception("Geen leesbare tekst gevonden in PDF")
                    
                return "\n\n".join(text).strip()
                
            except Exception as pdf_error:
                raise Exception(f"Fout bij het verwerken van PDF: {str(pdf_error)}")
                
    except Exception as e:
        raise Exception(f"PDF verwerkingsfout: {str(e)}")

def format_response(text):
    text = text.replace('\n', '<br>')
    formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    formatted = f'<div style="white-space: pre-line;">{formatted}</div>'
    return formatted

def create_pdf(text):
    try:
        # Initialiseer PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Stel marges in
        pdf.set_margins(20, 20, 20)
        
        # Voeg lettertype toe
        pdf.add_font('DejaVu', '', 'DejaVuSansCondensed.ttf', uni=True)
        pdf.add_font('DejaVu', 'B', 'DejaVuSansCondensed-Bold.ttf', uni=True)
        
        # Header met logo
        pdf.image('static/images/logo.png', x=85, y=10, h=35)
        pdf.ln(45)  # Ruimte na logo
        
        # Titel
        pdf.set_font('DejaVu', 'B', 16)
        pdf.cell(0, 10, 'Juridisch Advies', 0, 1, 'C')
        pdf.ln(10)
        
        # Datum
        pdf.set_font('DejaVu', '', 10)
        pdf.cell(0, 10, f'Datum: {datetime.now().strftime("%d-%m-%Y")}', 0, 1, 'R')
        pdf.ln(10)
        
        # Hoofdtekst
        pdf.set_font('DejaVu', '', 11)
        
        # Split tekst in paragrafen
        paragraphs = text.split('\n\n')
        
        for paragraph in paragraphs:
            # Check voor genummerde lijst
            if re.match(r'^\d+\.', paragraph.strip()):
                pdf.set_font('DejaVu', 'B', 11)
                number = paragraph.split('.')[0] + '.'
                content = '.'.join(paragraph.split('.')[1:]).strip()
                
                pdf.cell(10, 6, number, 0, 0)
                pdf.set_font('DejaVu', '', 11)
                
                # Multi-line support voor lange paragrafen
                lines = pdf.multi_cell(0, 6, content, 0, 'L', False, True)
                pdf.ln(4)
            else:
                # Normale paragraaf
                # Vervang ** markdown met bold tekst
                parts = re.split(r'\*\*(.*?)\*\*', paragraph)
                
                for i, part in enumerate(parts):
                    if i % 2 == 0:  # Normale tekst
                        pdf.set_font('DejaVu', '', 11)
                        pdf.multi_cell(0, 6, part, 0, 'L')
                    else:  # Bold tekst
                        pdf.set_font('DejaVu', 'B', 11)
                        pdf.multi_cell(0, 6, part, 0, 'L')
                
                pdf.ln(4)
        
        # Footer
        pdf.set_y(-30)
        pdf.set_font('DejaVu', '', 8)
        pdf.cell(0, 10, 'Dit document is gegenereerd door Collect Pro', 0, 1, 'C', link='https://www.collectpro.be')
        pdf.cell(0, 10, f'Pagina {pdf.page_no()}/{{nb}}', 0, 0, 'C')
        
        return pdf.output(dest='S').encode('latin-1')
        
    except Exception as e:
        print(f"PDF Creation Error: {e}")
        raise Exception(f"Fout bij het genereren van de PDF: {str(e)}")

def preprocess_text(text):
    """Remove excess whitespace and normalize text."""
    # Remove multiple newlines
    text = '\n'.join(line.strip() for line in text.splitlines() if line.strip())
    # Remove multiple spaces
    text = ' '.join(text.split())
    return text

def chunk_text(text, max_chunk_size=800):
    """Split text into smaller chunks while trying to keep sentences intact."""
    # Normalize whitespace and remove excess newlines
    text = ' '.join(text.split())
    
    # If text is small enough, return as single chunk
    if len(text) <= max_chunk_size:
        return [text]
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence_length = len(sentence)
        
        # If a single sentence is longer than max_chunk_size, split it
        if sentence_length > max_chunk_size:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
                current_length = 0
            
            # Split long sentence into smaller parts
            words = sentence.split()
            current_part = []
            current_part_length = 0
            
            for word in words:
                word_length = len(word) + 1  # +1 for space
                if current_part_length + word_length > max_chunk_size:
                    if current_part:
                        chunks.append(' '.join(current_part))
                        current_part = []
                        current_part_length = 0
                current_part.append(word)
                current_part_length += word_length
            
            if current_part:
                chunks.append(' '.join(current_part))
            
        # If adding this sentence would exceed max_chunk_size, start a new chunk
        elif current_length + sentence_length + 1 > max_chunk_size:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
        
        # Add sentence to current chunk
        else:
            current_chunk.append(sentence)
            current_length += sentence_length + 1
    
    # Add the last chunk if it exists
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def format_analysis(text):
    """Format the analysis with consistent styling."""
    # Remove any greetings or signatures
    lines = text.split('\n')
    cleaned_lines = []
    skip_line = False
    
    for line in lines:
        # Skip greetings and signatures
        if any(x in line.lower() for x in ['beste', 'geachte', 'hoogachtend', 'met vriendelijke groet', '[', 'juridisch']):
            skip_line = True
            continue
            
        if skip_line and line.strip() == '':
            skip_line = False
            continue
            
        if not skip_line:
            cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    
    # Format main sections
    text = re.sub(r'^(\d+\.\s*[A-Z][^a-z]+)$', r'<h2 class="analysis-section">\1</h2>', text, flags=re.MULTILINE)
    
    # Format subsections
    text = re.sub(r'^(\d+\.\d+\s+[A-Za-z].+)$', r'<h3 class="analysis-subsection">\1</h3>', text, flags=re.MULTILINE)
    
    # Format bullet points
    text = re.sub(r'^[•\-]\s+(.+)$', r'<li class="analysis-point">\1</li>', text, flags=re.MULTILINE)
    
    # Wrap bullet points in ul
    text = re.sub(r'(<li class="analysis-point">.+</li>\n?)+', r'<ul class="analysis-list">\n\g<0></ul>', text)
    
    # Add section dividers
    text = re.sub(r'(</h2>)', r'\1<hr class="section-divider">', text)
    
    return f'<div class="analysis-content">{text}</div>'

def consolidate_analysis(analyses):
    """Combine separate analyses into one coherent analysis."""
    # Filter out error messages
    valid_analyses = [a for a in analyses if not a.startswith("Error bij analyse")]
    
    if not valid_analyses:
        return "Kon geen geldige analyse uitvoeren vanwege fouten."
    
    consolidated_prompt = f"""
Hier zijn de verschillende delen van de contract analyse. Combineer deze in één duidelijk en gestructureerd rapport.

ANALYSES:
{"-" * 80}
{"\n\n".join(valid_analyses)}
{"-" * 80}

Maak hier één samenhangend rapport van met de volgende structuur:

1. Wettelijke Conformiteit
- Geef een complete analyse van alle wettelijke aspecten
- Focus op de belangrijkste compliance punten
- Identificeer eventuele strijdigheden met de wet

2. Risico's en Aandachtspunten
- Beschrijf de belangrijkste risico's
- Identificeer onduidelijke of problematische clausules
- Geef aan welke bepalingen extra aandacht verdienen

3. Verbetervoorstellen
- Geef concrete aanbevelingen voor verbetering
- Stel alternatieve formuleringen voor
- Adviseer over ontbrekende elementen

Verwijder dubbele informatie en maak er één vloeiend geheel van.
"""
    
    try:
        response = analyze_with_openrouter(consolidated_prompt, model_key='claude-2')
        return response
    except Exception as e:
        print(f"Error during consolidation: {e}")
        # Als consolidatie faalt, return de originele analyses
        return "\n\n---\n\n".join(valid_analyses)

EXTRA_BENEFITS = {
    'maaltijdcheques': {
        'name': 'Maaltijdcheques',
        'description': 'Deze cheques kun je gebruiken voor de aankoop van maaltijden of voedingsmiddelen. Ze zijn vrijgesteld van belastingen en sociale zekerheidsbijdragen.',
        'type': 'monthly'
    },
    'ecocheques': {
        'name': 'Ecocheques',
        'description': 'Met ecocheques kun je ecologische producten en diensten aanschaffen, zoals energiezuinige apparaten of fietsen. Ook deze zijn vrijgesteld van belastingen en sociale bijdragen.',
        'type': 'yearly'
    },
    'bedrijfswagen': {
        'name': 'Bedrijfswagen',
        'description': 'Een bedrijfswagen die je ook privé mag gebruiken. Dit voordeel is onderworpen aan een "voordeel van alle aard" dat belast wordt.',
        'type': 'continuous'
    },
    'hospitalisatieverzekering': {
        'name': 'Hospitalisatieverzekering',
        'description': 'Een verzekering die medische kosten dekt bij ziekenhuisopnames, vaak uitgebreid naar gezinsleden. Dit voordeel is vrijgesteld van sociale bijdragen en belastingen.',
        'type': 'insurance'
    },
    'groepsverzekering': {
        'name': 'Groepsverzekering',
        'description': 'Een aanvullend pensioenplan waarbij de werkgever premies stort voor je pensioenopbouw. Dit is fiscaal aantrekkelijk voor beide partijen.',
        'type': 'pension'
    },
    'gsm_laptop': {
        'name': 'GSM en laptop',
        'description': 'Werkgevers kunnen een gsm en/of laptop ter beschikking stellen, al dan niet met abonnement, wat handig is voor zowel werk- als privégebruik.',
        'type': 'equipment'
    },
    'fietsvergoeding': {
        'name': 'Fietsvergoeding',
        'description': 'Een kilometervergoeding voor werknemers die met de fiets naar het werk komen, wat zowel fiscaal voordelig is als milieuvriendelijk.',
        'type': 'mobility'
    },
    'loonbonus': {
        'name': 'Loonbonus of winstpremie',
        'description': 'Extra verloning op basis van collectieve prestaties of winst, vaak met een gunstig fiscaal regime.',
        'type': 'bonus'
    },
    'cafetariaplan': {
        'name': 'Cafetariaplan',
        'description': 'Een flexibel verloningssysteem waarbij je zelf kunt kiezen uit verschillende voordelen binnen een bepaald budget, afgestemd op je persoonlijke behoeften.',
        'type': 'flexible'
    }
}

CONTRACT_TEMPLATES = {
    'arbeidsovereenkomst': {
        'context': 'Dit is een arbeidsovereenkomst volgens Belgisch arbeidsrecht.',
        'required_fields': [
            'company_name',
            'company_street',
            'company_number',
            'company_postcode',
            'company_city',
            'company_vat',
            'employee_name',
            'employee_street',
            'employee_number',
            'employee_postcode',
            'employee_city',
            'employee_id',
            'job_title',
            'salary',
            'start_date',
            'contract_duration',
            'extra_benefits'
        ],
        'questions': [
            'Wat is de naam van uw bedrijf?',
            'Wat is de straatnaam van uw bedrijf?',
            'Wat is het huisnummer van uw bedrijf?',
            'Wat is de postcode van uw bedrijf?',
            'In welke gemeente is uw bedrijf gevestigd?',
            'Wat is uw BTW nummer?',
            'Wat is de naam van de werknemer?',
            'Wat is de straatnaam van de werknemer?',
            'Wat is het huisnummer van de werknemer?',
            'Wat is de postcode van de werknemer?',
            'In welke gemeente woont de werknemer?',
            'Wat is het rijksregisternummer van de werknemer?',
            'Wat is de functietitel van de werknemer?',
            'Wat is het bruto maandsalaris?',
            'Wat is de startdatum van het contract?',
            'Is dit een contract van bepaalde of onbepaalde duur?',
            'Welke extralegale voordelen wilt u toevoegen aan het contract? (Kies uit de lijst)'
        ],
        'extra_benefits': EXTRA_BENEFITS
    },
    'huurovereenkomst': {
        'context': 'Dit is een huurovereenkomst voor een woning volgens Belgisch huurrecht.',
        'required_fields': [
            'verhuurder_naam',
            'huurder_naam',
            'adres_pand',
            'huurprijs',
            'startdatum',
            'duurtijd'
        ]
    },
    'dienstenovereenkomst': {
        'context': 'Dit is een overeenkomst voor het leveren van diensten volgens Belgisch recht.',
        'required_fields': [
            'dienstverlener_naam',
            'klant_naam',
            'diensten_beschrijving'
        ]
    },
    'algemene-voorwaarden': {
        'context': 'Dit zijn algemene voorwaarden volgens Belgisch recht, met focus op het Wetboek van Economisch Recht (WER) en GDPR/AVG-wetgeving.',
        'required_fields': [
            'bedrijfsnaam',
            'bedrijf_btw',
            'bedrijf_adres',
            'diensten_beschrijving'
        ]
    }
}

# OpenRouter configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

def create_ssl_context():
    """Create a custom SSL context with modern settings."""
    context = ssl.create_default_context()
    context.set_ciphers('DEFAULT@SECLEVEL=1')  # Allow less secure ciphers
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    return context

def analyze_with_openrouter(text, model_key='claude-2'):
    """Analyze text using OpenRouter API with specified model."""
    model = AI_MODELS[model_key]
    
    headers = {
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'HTTP-Referer': 'http://localhost:5000',
        'Content-Type': 'application/json'
    }
    
    system_prompt = """
Je bent een juridische analyse tool die contracten analyseert volgens Belgisch recht.
Geef alleen feitelijke analyses zonder persoonlijke aanspreking of ondertekening.
Gebruik een consistente structuur met hoofdstukken (1., 2., 3.) en subhoofdstukken (1.1, 1.2, etc.).
Gebruik bulletpoints (•) voor specifieke punten onder elk subhoofdstuk.
"""
    
    data = {
        'model': model['name'],
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': text}
        ],
        'temperature': 0.7,
        'max_tokens': 4096,
        'top_p': 1,
        'stream': False
    }
    
    try:
        print(f"Calling OpenRouter API with model: {model['name']}")
        response = requests.post(
            OPENROUTER_BASE_URL,
            headers=headers,
            json=data,
            timeout=model['timeout']
        )
        
        if response.status_code != 200:
            print(f"OpenRouter API Error: {response.status_code}")
            print(f"Response content: {response.text}")
            response.raise_for_status()
            
        result = response.json()
        return result['choices'][0]['message']['content']
        
    except Exception as e:
        print(f"OpenRouter API Error: {str(e)}")
        raise

# Available models configuration
AI_MODELS = {
    'claude-2': {
        'name': 'anthropic/claude-2',
        'max_tokens': 100000,
        'timeout': 180,
        'chunk_size': 12000
    },
    'gpt-4-32k': {
        'name': 'openai/gpt-4-32k',
        'max_tokens': 32000,
        'timeout': 150,
        'chunk_size': 8000
    },
    'claude-instant': {
        'name': 'anthropic/claude-instant-1',
        'max_tokens': 100000,
        'timeout': 120,
        'chunk_size': 12000
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/legal-advice', methods=['POST'])
def get_legal_advice():
    try:
        data = request.get_json()
        question = data.get('question', '')
        format_type = data.get('format', 'html')
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """Je bent een juridische assistent die gespecialiseerd is in Belgisch recht. 
                
                Structureer je antwoorden als volgt:
                1. Begin met een korte samenvatting van de vraag
                2. Geef dan het juridische antwoord in duidelijke paragrafen
                3. Gebruik bulletpoints waar nodig
                4. Eindig met een korte conclusie
                
                Gebruik **tekst tussen sterretjes** om belangrijke delen te benadrukken.
                Begin elke nieuwe paragraaf op een nieuwe regel.
                Laat een lege regel tussen paragrafen."""},
                {"role": "user", "content": question}
            ]
        )
        
        answer = response.choices[0].message['content'].strip()
        formatted_answer = format_response(answer)
        
        if format_type == 'pdf':
            try:
                pdf_content = create_pdf(answer)  
                return send_file(
                    io.BytesIO(pdf_content),
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name=f'juridisch_advies_{datetime.now().strftime("%Y%m%d_%H%M")}.pdf'
                )
            except Exception as pdf_error:
                print(f"PDF Error: {pdf_error}")
                return jsonify({"error": f"PDF generatie fout: {str(pdf_error)}"}), 500
        
        return jsonify({"response": formatted_answer})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate-contract', methods=['POST'])
def generate_contract():
    try:
        data = request.get_json()
        contract_type = data.get('type')
        details = data.get('details', {})
        
        if not contract_type or not details:
            return jsonify({"error": "Contract type en details zijn verplicht"}), 400
            
        # Haal contract template en context op
        template_data = CONTRACT_TEMPLATES.get(contract_type)
        if not template_data:
            return jsonify({"error": f"Ongeldig contract type: {contract_type}"}), 400
            
        # Controleer verplichte velden
        missing_fields = [field for field in template_data['required_fields'] 
                         if field not in details or not details[field]]
        if missing_fields:
            return jsonify({
                "error": f"De volgende verplichte velden ontbreken: {', '.join(missing_fields)}"
            }), 400
            
        # Genereer contract met OpenAI
        prompt = f"""
        Genereer een {contract_type} volgens Belgisch recht.
        
        Context:
        {template_data['context']}
        
        Details:
        {json.dumps(details, indent=2)}
        
        Genereer een professioneel contract in het Nederlands, met alle nodige clausules en wettelijke vereisten.
        Gebruik een duidelijke structuur met artikelen en secties.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Je bent een Belgische juridische expert gespecialiseerd in het opstellen van contracten."},
                {"role": "user", "content": prompt}
            ]
        )
        
        contract_text = response.choices[0].message['content'].strip()
        
        return jsonify({"contract": contract_text})
        
    except Exception as e:
        print(f"Contract Generation Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-contract', methods=['POST'])
def analyze_contract():
    try:
        print("Starting contract analysis...")
        data = request.get_json()
        contract_text = data.get('contract_text')
        
        if not contract_text:
            return jsonify({"error": "Geen contracttekst gevonden"}), 400
        
        print(f"Contract length: {len(contract_text)} characters")
        chunks = chunk_text(contract_text)
        print(f"Split into {len(chunks)} chunks")
        analyses = []
        
        for i, chunk in enumerate(chunks, 1):
            print(f"Analyzing chunk {i}/{len(chunks)}...")
            try:
                prompt = f"""
Analyseer dit contract volgens Belgisch recht. Gebruik exact deze structuur en zorg voor concrete inhoud onder elke heading:

1. WETTELIJKE CONFORMITEIT

1.1 Strijdigheden met wetgeving
• Specificeer elke strijdigheid met de wet
• Citeer relevante wetsartikelen
• Leg uit waarom het strijdig is

1.2 Ontbrekende verplichte elementen
• Noem elk ontbrekend element
• Citeer de wettelijke basis die dit vereist
• Leg uit waarom het element verplicht is

2. RISICO'S EN AANDACHTSPUNTEN

2.1 Juridische risico's
• Beschrijf elk risico concreet
• Leg uit waarom het een risico vormt
• Geef mogelijke gevolgen

2.2 Onduidelijke bepalingen
• Citeer de onduidelijke clausule
• Leg uit waarom deze onduidelijk is
• Beschrijf mogelijke interpretatieproblemen

2.3 Ontbrekende bepalingen
• Identificeer ontbrekende bepalingen
• Leg uit waarom deze nodig zijn
• Beschrijf mogelijke gevolgen van het ontbreken

3. VERBETERVOORSTELLEN

3.1 Aanpassingen bestaande clausules
• Citeer de originele clausule
• Geef concrete herformulering
• Leg uit waarom deze aanpassing nodig is

3.2 Toe te voegen clausules
• Geef de voorgestelde clausuletekst
• Leg uit waarom deze nodig is
• Beschrijf het beoogde effect

Contract tekst:
{chunk}

Belangrijk:
- Geef onder ELKE heading concrete inhoud
- Gebruik altijd bulletpoints voor de details
- Citeer specifieke tekstdelen uit het contract
- Verwijs naar specifieke wetsartikelen
- Geen inleiding of afsluiting
"""
                
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": BELGIAN_LEGAL_CONTEXT},
                        {"role": "user", "content": prompt}
                    ],
                    timeout=30
                )
                
                analysis = response.choices[0].message['content'].strip()
                analyses.append(f"Deel {i}:\n{analysis}")
                print(f"Chunk {i} analyzed successfully")
                
            except Exception as chunk_error:
                print(f"Error analyzing chunk {i}: {str(chunk_error)}")
                analyses.append(f"Deel {i}: Analyse fout - {str(chunk_error)}")
        
        print("Combining analyses...")
        full_analysis = "\n\n---\n\n".join(analyses)
        
        if len(chunks) > 1:
            print("Creating summary...")
            try:
                summary_response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "Maak een korte samenvatting."},
                        {"role": "user", "content": "Vat de kernpunten samen:\n" + full_analysis}
                    ],
                    timeout=30
                )
                
                summary = summary_response.choices[0].message['content'].strip()
                full_analysis = f"SAMENVATTING:\n{summary}\n\nDETAILS:\n{full_analysis}"
                print("Summary created successfully")
                
            except Exception as summary_error:
                print(f"Error creating summary: {str(summary_error)}")
                full_analysis = f"FOUT BIJ SAMENVATTING: {str(summary_error)}\n\nDETAILS:\n{full_analysis}"
        
        print("Analysis complete, returning results...")
        return jsonify({"analysis": full_analysis})
        
    except Exception as e:
        error_msg = f"Contract Analysis Error: {str(e)}"
        print(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/upload-contract', methods=['POST'])
def upload_contract():
    """Handle PDF contract upload with improved error handling."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Geen bestand geüpload"}), 400
            
        uploaded_file = request.files['file']
        
        if uploaded_file.filename == '':
            return jsonify({"error": "Geen bestand geselecteerd"}), 400
            
        if not allowed_file(uploaded_file.filename):
            return jsonify({"error": "Alleen PDF bestanden zijn toegestaan"}), 400
        
        # Create upload folder if it doesn't exist
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Save uploaded file
        filename = secure_filename(uploaded_file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        uploaded_file.save(file_path)
        
        try:
            # Extract text from PDF
            contract_text = extract_text_from_pdf(file_path)
            
            if not contract_text.strip():
                raise Exception("Geen tekst gevonden in PDF")
            
            # Select model based on text length
            text_length = len(contract_text)
            if text_length > 50000:
                model_key = 'claude-2'
            elif text_length > 20000:
                model_key = 'gpt-4-32k'
            else:
                model_key = 'claude-instant'
            
            print(f"Using model: {model_key} for text length: {text_length}")
            
            # Split text into chunks
            chunks = chunk_text(contract_text, AI_MODELS[model_key]['chunk_size'])
            print(f"Split into {len(chunks)} chunks")
            
            # Collect all text parts for one analysis
            all_parts = []
            for i, chunk in enumerate(chunks, 1):
                part = f"\nDeel {i}:\n{'-' * 40}\n{chunk}\n{'-' * 40}"
                all_parts.append(part)
            
            full_text = "\n".join(all_parts)
            
            # Analyze everything at once
            prompt = f"""
Analyseer dit contract volgens Belgisch recht. Gebruik exact deze structuur en zorg voor concrete inhoud onder elke heading:

1. WETTELIJKE CONFORMITEIT

1.1 Strijdigheden met wetgeving
• Specificeer elke strijdigheid met de wet
• Citeer relevante wetsartikelen
• Leg uit waarom het strijdig is

1.2 Ontbrekende verplichte elementen
• Noem elk ontbrekend element
• Citeer de wettelijke basis die dit vereist
• Leg uit waarom het element verplicht is

2. RISICO'S EN AANDACHTSPUNTEN

2.1 Juridische risico's
• Beschrijf elk risico concreet
• Leg uit waarom het een risico vormt
• Geef mogelijke gevolgen

2.2 Onduidelijke bepalingen
• Citeer de onduidelijke clausule
• Leg uit waarom deze onduidelijk is
• Beschrijf mogelijke interpretatieproblemen

2.3 Ontbrekende bepalingen
• Identificeer ontbrekende bepalingen
• Leg uit waarom deze nodig zijn
• Beschrijf mogelijke gevolgen van het ontbreken

3. VERBETERVOORSTELLEN

3.1 Aanpassingen bestaande clausules
• Citeer de originele clausule
• Geef concrete herformulering
• Leg uit waarom deze aanpassing nodig is

3.2 Toe te voegen clausules
• Geef de voorgestelde clausuletekst
• Leg uit waarom deze nodig is
• Beschrijf het beoogde effect

Contract tekst:
{full_text}

Belangrijk:
- Geef onder ELKE heading concrete inhoud
- Gebruik altijd bulletpoints voor de details
- Citeer specifieke tekstdelen uit het contract
- Verwijs naar specifieke wetsartikelen
- Geen inleiding of afsluiting
"""
            
            print("Starting analysis...")
            try:
                analysis = analyze_with_openrouter(prompt, model_key='claude-2')
                print("Analysis completed successfully")
                
                # Format the analysis
                formatted_analysis = format_analysis(analysis)
                
                return jsonify({
                    "analysis": f'<div class="analysis-container">{formatted_analysis}</div>'
                })
                
            except Exception as analysis_error:
                error_msg = f"Fout bij analyse: {str(analysis_error)}"
                print(error_msg)
                return jsonify({"error": error_msg}), 500
            
        except Exception as text_error:
            raise Exception(f"Fout bij tekstextractie: {str(text_error)}")
            
        finally:
            # Cleanup: remove uploaded file
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as cleanup_error:
                    print(f"Waarschuwing: Kon tijdelijk bestand niet verwijderen: {str(cleanup_error)}")
                    
    except Exception as e:
        error_msg = f"Fout bij verwerken van PDF: {str(e)}"
        print(error_msg)
        return jsonify({"error": error_msg}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
