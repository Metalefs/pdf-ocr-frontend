---
title: "Como Migrar Muitos Documentos para o Digital em Poucos Dias (Modelo de Projeto)"
slug: migrar-10000-documentos-digital-uma-semana
date: 2026-01-09
author: TextLayer Team
category: Case Study
tags: [case-study, migracao, digitalizacao, batch-processing, automacao]
excerpt: "Modelo prático para planejar uma migração em lote (escaneamento → OCR → QA → indexação) com dicas de pipeline, organização e qualidade."
featured: true
readTime: 16
seo:
    description: "Modelo de projeto para migração em lote de documentos com OCR: planejamento, pipeline, controle de qualidade e indexação, com exemplos ilustrativos."
  keywords: "migracao documentos digital, batch processing ocr, digitalizacao em lote, case study ocr"
---

# Como Migrar Muitos Documentos para o Digital em Poucos Dias (Modelo de Projeto)

Nota: este artigo usa números e exemplos **ilustrativos** para explicar a estratégia. Ajuste volumes, prazos e custos para a sua operação.

Exemplo de cenário:

- **Desafio:** migrar um acervo físico para PDFs pesquisáveis
- **Objetivo:** organizar, processar e indexar para busca
- **Prazo:** curto (dias/semanas)

## 📊 Exemplo de dimensionamento

```yaml
Documentos: milhares
Páginas: dezenas de milhares
Tempo total: dias (dependendo do scanner, equipe e QA)
Equipe: 2+ pessoas + infraestrutura OCR
```

## 🎯 Planejamento (Dia 0)

### Análise Inicial

**Inventário:**
- 10.000 processos físicos (1995-2023)
- Qualidade variável (alguns digitalizados anos 90)
- Organização por ano + número de processo
- Necessidade de busca full-text pós-migração

**Requisitos:**
- Preservar estrutura de pastas
- Gerar PDF pesquisável para cada processo
- Indexar para busca rápida
- Manter conformidade LGPD
- Budget: R$ 10.000

### Escolha da Estratégia

| Opção | Custo | Tempo | Descartada? |
|-------|-------|-------|-------------|
| Digitação manual | R$ 95K | 60 dias | ✅ Muito caro/lento |
| Terceirizar bureau | R$ 45K | 15 dias | ✅ Prazo/custo alto |
| OCR batch interno | R$ 8.5K | 7 dias | ✅ **Escolhida** |

### Pipeline Definido

```
Digitalização → Upload Batch → OCR Processing → Quality Check → Indexação → Deploy
     ↓              ↓               ↓                ↓              ↓         ↓
   2 dias        1 dia          2 dias           0.5 dia        0.5 dia   Setup
```

---

## 🔧 Implementação

### Dia 1-2: Digitalização (Scanner Industrial)

**Equipamento:**
- Scanner Fujitsu fi-7600 (100 ppm)
- Capacidade: 200 páginas/lote
- Custo aluguel: R$ 800/semana

**Processo:**
```
1. Remover grampos/clipes
2. Carregar 200 páginas no scanner
3. Scan → PDF multi-página
4. Nomear: YYYY_PROCESSO_NUMERO.pdf
5. Repetir
```

**Produtividade:**
- 1 pessoa full-time escaneando
- ~6.000 páginas/dia (60 pgs/minuto efetivo)
- 50.000 páginas ÷ 6.000/dia = 8.3 dias → **Paralelizado com OCR!**

### Dia 2-3: Upload e Organização

**Script de Upload Batch:**

```python
import os
import asyncio
import aiohttp
from pathlib import Path

class BatchUploader:
    def __init__(self, api_url, api_key):
        self.api_url = api_url
        self.api_key = api_key
        self.semaphore = asyncio.Semaphore(10)  # 10 uploads paralelos
    
    async def upload_file(self, file_path):
        async with self.semaphore:
            async with aiohttp.ClientSession() as session:
                with open(file_path, 'rb') as f:
                    form = aiohttp.FormData()
                    form.add_field('file', f, filename=os.path.basename(file_path))
                    
                    async with session.post(
                        f"{self.api_url}/api/batch-process",
                        data=form,
                        headers={'Authorization': f'Bearer {self.api_key}'}
                    ) as response:
                        result = await response.json()
                        print(f"✓ {file_path}: {result['job_id']}")
                        return result
    
    async def upload_directory(self, directory):
        files = list(Path(directory).rglob('*.pdf'))
        print(f"Encontrados {len(files)} arquivos")
        
        tasks = [self.upload_file(str(f)) for f in files]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        success = sum(1 for r in results if not isinstance(r, Exception))
        print(f"\n✓ {success}/{len(files)} uploads concluídos")

# Uso
uploader = BatchUploader(
    api_url='https://textlayerocr.com',
    api_key='seu-api-key'
)

asyncio.run(uploader.upload_directory('documentos_escaneados/'))
```

**Resultados:**
- 10.000 arquivos uploaded em 4 horas
- Throughput: 42 uploads/minuto
- Falhas: 0.3% (rede instável) → retry automático

### Dia 3-4: OCR Batch Processing

**Infraestrutura:**

```yaml
Cloud: AWS EC2
Instâncias: 4x c6i.2xlarge (8 vCPUs, 16GB RAM cada)
OCR Engine: Tesseract 5.3 + TextLayer API
Processamento paralelo: 32 threads (8 por instância)
Storage: S3 (entrada e saída)
```

**Worker de Processamento:**

```csharp
public class BatchOCRWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private const int MAX_PARALLEL = 8;
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            var jobQueue = scope.ServiceProvider.GetRequiredService<IJobQueue>();
            var ocrService = scope.ServiceProvider.GetRequiredService<IOCRService>();
            
            // Pegar próximos 8 jobs
            var jobs = await jobQueue.DequeueAsync(MAX_PARALLEL);
            
            if (!jobs.Any())
            {
                await Task.Delay(5000, stoppingToken); // Aguardar novos jobs
                continue;
            }
            
            // Processar em paralelo
            var tasks = jobs.Select(job => ProcessJob(job, ocrService));
            await Task.WhenAll(tasks);
        }
    }
    
    private async Task ProcessJob(Job job, IOCRService ocrService)
    {
        try
        {
            // 1. Download do S3
            var pdfBytes = await _s3.DownloadAsync(job.InputPath);
            
            // 2. OCR
            var result = await ocrService.ProcessPdfAsync(pdfBytes);
            
            // 3. Upload resultado para S3
            await _s3.UploadAsync(job.OutputPath, result.PdfBytes);
            
            // 4. Indexar texto para busca
            await _searchService.IndexAsync(job.ProcessNumber, result.Text);
            
            // 5. Marcar como concluído
            await _jobQueue.CompleteAsync(job.Id);
            
            _logger.LogInformation($"✓ Processo {job.ProcessNumber} concluído");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro no processo {job.ProcessNumber}");
            await _jobQueue.RetryAsync(job.Id);
        }
    }
}
```

**Performance:**
```
Throughput: 
- 4 instâncias × 8 threads = 32 processos simultâneos
- Tempo médio: 45 segundos/processo (5 páginas)
- Capacidade: 2.560 processos/dia
- 10.000 processos ÷ 2.560/dia = 3.9 dias

Real: 2.5 dias (otimizações adicionais)
```

### Dia 5: Quality Check Automatizado

**Script de Validação:**

```python
import pytesseract
from pdf2image import convert_from_path

class QualityChecker:
    def check_document(self, pdf_path):
        issues = []
        
        # 1. Verificar se tem texto pesquisável
        text = extract_text_from_pdf(pdf_path)
        if len(text.strip()) < 100:
            issues.append("TextTooShort")
        
        # 2. Verificar confiança média
        images = convert_from_path(pdf_path, first_page=1, last_page=1)
        data = pytesseract.image_to_data(images[0], output_type=pytesseract.Output.DICT)
        
        confidences = [int(c) for c in data['conf'] if c != '-1']
        avg_conf = sum(confidences) / len(confidences)
        
        if avg_conf < 75:
            issues.append(f"LowConfidence:{avg_conf:.1f}%")
        
        # 3. Verificar número de páginas esperado
        page_count = len(convert_from_path(pdf_path))
        if page_count < 2:  # Esperado: mínimo 2 páginas
            issues.append(f"FewPages:{page_count}")
        
        return {
            'pdf': pdf_path,
            'passed': len(issues) == 0,
            'issues': issues,
            'confidence': avg_conf
        }

# Processar lote
checker = QualityChecker()
results = [checker.check_document(pdf) for pdf in all_pdfs]

# Filtrar problemas
failed = [r for r in results if not r['passed']]
print(f"✓ {len(results) - len(failed)}/{len(results)} passaram")
print(f"⚠️  {len(failed)} requerem revisão manual")

# Exportar relatório
pd.DataFrame(failed).to_csv('failed_quality_check.csv')
```

**Resultados:**
- 9.847 processos (98.5%) passaram automaticamente
- 153 processos (1.5%) marcados para revisão
- Revisão manual: 4 horas (1 pessoa)
- Principais problemas: PDFs já digitais (não precisavam OCR)

### Dia 6: Indexação e Deploy

**Elasticsearch Setup:**

```yaml
# docker-compose.yml
version: '3'
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - 9200:9200
    volumes:
      - es_data:/usr/share/elasticsearch/data

volumes:
  es_data:
```

**Script de Indexação:**

```python
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import fitz  # PyMuPDF

es = Elasticsearch(['http://localhost:9200'])

# Criar índice
es.indices.create(index='processos', body={
    "mappings": {
        "properties": {
            "numero_processo": {"type": "keyword"},
            "ano": {"type": "integer"},
            "texto_completo": {"type": "text", "analyzer": "portuguese"},
            "data_digitalizacao": {"type": "date"},
            "num_paginas": {"type": "integer"}
        }
    }
})

def index_document(pdf_path):
    # Extrair texto
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text() for page in doc)
    
    # Extrair metadados do filename: 2015_PROC_12345.pdf
    filename = os.path.basename(pdf_path)
    year, _, number = filename.replace('.pdf', '').split('_')
    
    return {
        "_index": "processos",
        "_id": number,
        "_source": {
            "numero_processo": number,
            "ano": int(year),
            "texto_completo": text,
            "data_digitalizacao": datetime.now(),
            "num_paginas": len(doc)
        }
    }

# Indexar em lote
actions = [index_document(pdf) for pdf in all_pdfs]
success, failed = bulk(es, actions)

print(f"✓ {success} documentos indexados")
```

**Interface de Busca:**

```javascript
// Frontend simples para busca
async function searchProcessos(query) {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    
    const results = await response.json();
    
    displayResults(results.hits.map(hit => ({
        numero: hit._source.numero_processo,
        ano: hit._source.ano,
        snippet: highlightMatch(hit._source.texto_completo, query),
        score: hit._score
    })));
}

// Buscar "contrato locação"
searchProcessos("contrato locação");
// Retorna em <300ms resultados relevantes dos 10K processos
```

---

## 💰 Análise de Custos

### Investimento Real

| Item | Custo | Observação |
|------|-------|------------|
| Scanner (aluguel 1 semana) | R$ 800 | Fujitsu fi-7600 |
| AWS EC2 (4x c6i.2xlarge, 72h) | R$ 2.400 | ~R$ 0.27/hora cada |
| S3 Storage (100GB, 1 mês) | R$ 50 | Entrada + saída |
| Elasticsearch (t3.medium, 1 mês) | R$ 350 | Busca full-text |
| TextLayer OCR API (50K páginas) | R$ 2.500 | R$ 0.05/página |
| Mão de obra (2 pessoas, 6 dias) | R$ 2.400 | R$ 200/dia/pessoa |
| **TOTAL** | **R$ 8.500** | |

### Comparativo com Alternativas

| Método | Custo | Tempo | Qualidade |
|--------|-------|-------|-----------|
| **OCR Batch (escolhido)** | R$ 8.5K | 6 dias | 98.5% |
| Digitação manual | R$ 95K | 60 dias | 96% |
| Bureau terceirizado | R$ 45K | 15 dias | 97% |

**ROI:** R$ 86.500 economizados (91% redução vs manual)

---

## 📊 Métricas Finais

```yaml
Tempo de projeto: 6 dias (vs 60 dias manual)
Documentos processados: 10.000 (100%)
Páginas processadas: 50.000
Taxa de sucesso: 98.5%
Tempo médio busca: 280ms (full-text em 10K docs)
Satisfação cliente: 10/10
Economia total: R$ 86.500

Performance:
  - Throughput: 8.333 docs/dia
  - Velocidade: 1 doc a cada 10.4 segundos
  - Precisão OCR: 96.8% (média ponderada)
  - Uptime: 99.7%
```

---

## 🚀 Replicando o Projeto

### Checklist de Preparação
- [ ] Inventário completo de documentos
- [ ] Definir estrutura de organização
- [ ] Escolher scanner (capacidade vs custo)
- [ ] Provisionar infraestrutura cloud
- [ ] Configurar pipeline de OCR
- [ ] Implementar quality check
- [ ] Setup de busca (Elasticsearch)
- [ ] Treinar equipe
- [ ] Teste piloto (100 docs)
- [ ] Executar migração completa

Se você quiser aprofundar o tema, estes guias complementam bem esse modelo:

- [Guia: Como Adicionar Camadas de Texto em PDFs Escaneados →](/pt/blog/adicionar-camada-texto-pdf-escaneado)
- [Automatizando Formulários PDF com OCR e Webhooks →](/pt/blog/automatizar-formularios-pdf-ocr-webhooks)
- [Compliance e LGPD ao Processar Documentos →](/pt/blog/lgpd-compliance-digitalizacao-documentos)
- [Docs da API →](/docs/api)

**Tags:** #CaseStudy #Migração #BatchProcessing #OCR #Digitalização
