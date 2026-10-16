import { appendFile, readFile } from 'fs/promises'
import { load } from 'js-yaml'

interface SpamFilter {
  filter_name: string
  filter: [string]
  reason: string
}

interface SpamFilterConfig {
  filters: [SpamFilter]
}

export async function checkReason(reason: string): Promise<string | undefined> {
  const config: SpamFilterConfig | undefined = await loadSpamFilter()
  
  if (config !== undefined) {
    const filters: [SpamFilter] = config.filters
    
    for (let index: number = 0; index < filters.length; index++) {
      const filter: SpamFilter | undefined = filters[index]
      
      if (filter !== undefined) {
        const filtered: string | undefined = await filterRegistration(reason, filter)
        
        if (filtered !== undefined) {
          const out: string = `Filtered by regex: ${filtered}\nReason: ${filter.reason}`
          return out
        }
      }
      
    }
    
  }
  
  return undefined
}

async function filterRegistration(reason: string, filter: SpamFilter): Promise<string | undefined> {
  const filters: [string] = filter.filter
  
  for (let index: number = 0; index < filters.length; index++) {
    const filter: string | undefined = filters[index]
    
    if (filter !== undefined) {
      const regex: RegExp = new RegExp(`${filter}`)
      
      if (regex.test(reason) == true) {
        return filter
      }
      
    }
    
  }
  
  return undefined
}

async function getConfigFile(filePath: string | undefined): Promise<string | undefined> {
  if (filePath !== undefined) {
    try {
      const contents: string = await readFile(filePath, "utf8")
      return contents
    } catch (err) {
      console.log(err)
      return undefined
    }
  } else {
    return undefined
  }
}

/**
 * $REG_SPAM_FILTER needs to be set here in order for the YAML file to be
 * found, was a lot less intrusive of a patch to make for upstream compatability.
 */

async function loadSpamFilter(): Promise<SpamFilterConfig | undefined> {
  const filePath: string | undefined = process.env.REG_SPAM_FILTER
  const configFile: string | undefined = await getConfigFile(filePath)
  
  if (configFile !== undefined) {
    const config: SpamFilterConfig | null = load(configFile) as SpamFilterConfig | null
    
    if (config !== null) {
      return config
    } else {
      console.log("Could not parse spam-filter.yaml")
      return undefined
    }
    
  } else {
    return undefined
  }
}

export async function logFailedAttempt(output: string) {
  const logFile: string | undefined = process.env.REG_SPAM_FILTER_LOG

  if (logFile !== undefined) {
    try {
      await appendFile(logFile, `[${new Date().toISOString()}]:\n${output}\n`, 'utf8')
    } catch (err) {
      console.log(`Could not log output: ${err}\nMake sure to set the REG_SPAM_FILTER_LOG envar!`)
    }
  }
}
