import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'

export function parseCSV<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'data', filename)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  
  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  
  return result.data as T[]
}