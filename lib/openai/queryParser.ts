import { getOpenAIClient, OPENAI_MODEL } from './client'
import type { ParsedQuery } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'

const SYSTEM_PROMPT = `You are a shopping assistant query parser for an Indian e-commerce platform.
Extract structured information from user queries about products.
Always respond with valid JSON matching the schema exactly.
Prices are in Indian Rupees (INR).`

export async function parseQuery(query: string): Promise<ParsedQuery> {
  if (!process.env.OPENAI_API_KEY) {
    return parseFallback(query)
  }

  try {
    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Parse this shopping query and return JSON with these fields:
- category: one of ${CATEGORIES.join(', ')} or null
- budget_min: minimum budget in INR or null
- budget_max: maximum budget in INR or null
- brands: array of brand names mentioned or []
- use_case: primary use case description or null
- requirements: array of specific requirements or []
- confidence: float 0-1 indicating parse confidence

Query: "${query}"`,
        },
      ],
    })

    const text = response.choices[0].message.content || '{}'
    const parsed = JSON.parse(text)
    return {
      category: parsed.category || undefined,
      budget_min: parsed.budget_min || undefined,
      budget_max: parsed.budget_max || undefined,
      brands: parsed.brands || [],
      use_case: parsed.use_case || undefined,
      requirements: parsed.requirements || [],
      confidence: parsed.confidence || 0.7,
    }
  } catch {
    return parseFallback(query)
  }
}

function parseFallback(query: string): ParsedQuery {
  const lower = query.toLowerCase()
  const parsed: ParsedQuery = { confidence: 0.5 }

  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase()) || lower.includes(cat.toLowerCase().slice(0, -1))) {
      parsed.category = cat
      break
    }
  }

  const budgetMatch = lower.match(/under\s*[₹rs\s]*([0-9,]+)/i)
  if (budgetMatch) {
    parsed.budget_max = parseInt(budgetMatch[1].replace(/,/g, ''))
  }

  const rangeMatch = lower.match(/([0-9,]+)\s*(?:to|-)\s*([0-9,]+)/i)
  if (rangeMatch) {
    parsed.budget_min = parseInt(rangeMatch[1].replace(/,/g, ''))
    parsed.budget_max = parseInt(rangeMatch[2].replace(/,/g, ''))
  }

  const brands = ['apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'sony', 'lg', 'oneplus', 'xiaomi', 'realme', 'oppo', 'bose', 'jbl']
  parsed.brands = brands.filter(b => lower.includes(b))

  return parsed
}

export async function generateRecommendationExplanation(
  query: string,
  productName: string,
  badge: string,
  score: number
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return `${productName} scores ${score}/100 for your query and is the ${badge} pick based on price-to-performance ratio.`
  }

  try {
    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful shopping assistant. Write concise, informative product recommendation explanations in 1-2 sentences.',
        },
        {
          role: 'user',
          content: `Why is "${productName}" the ${badge} for the query "${query}"? Score: ${score}/100.`,
        },
      ],
    })
    return response.choices[0].message.content || `${productName} is an excellent ${badge} choice.`
  } catch {
    return `${productName} scores ${score}/100 and is the ${badge} pick for your requirements.`
  }
}

export async function generateComparisonAnalysis(
  productNames: string[],
  query?: string
): Promise<{ analysis: string; winner: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      analysis: `Comparing ${productNames.join(' vs ')}. Each product has unique strengths. Consider your budget, use case, and brand preference to make the best choice.`,
      winner: productNames[0],
    }
  }

  try {
    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a product comparison expert. Analyze products and provide structured comparison. Respond with JSON.',
        },
        {
          role: 'user',
          content: `Compare these products: ${productNames.join(', ')}${query ? ` for: ${query}` : ''}.
Return JSON: { "analysis": "2-3 sentence comparison", "winner": "product name that wins overall" }`,
        },
      ],
    })

    const text = response.choices[0].message.content || '{}'
    const result = JSON.parse(text)
    return {
      analysis: result.analysis || `${productNames[0]} vs ${productNames.slice(1).join(' vs ')} - a competitive field.`,
      winner: result.winner || productNames[0],
    }
  } catch {
    return {
      analysis: `Comparing ${productNames.join(' vs ')}. All are strong contenders in their segment.`,
      winner: productNames[0],
    }
  }
}
