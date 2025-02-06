import { createClient } from "next-sanity"
import { projectId, dataset, apiVersion } from "../env"

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token:process.env.SANITY_API_TOKEN,
})