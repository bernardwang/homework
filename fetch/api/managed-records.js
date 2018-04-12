import fetch from "../util/fetch-fill"
import URI from "urijs"

// /records endpoint
window.path = "http://localhost:3000/records"

// Uses fetch to call the records endpoint
const getRecordsAPI = (endpoint) => {
  return fetch(endpoint, {
    accept: "application/json",
    method: "GET",
    credentials: "same-origin",
  }).then(response => {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  }).catch(error => {
    console.log("Records API request error")
    console.log(error)
    return []
  })
}

// Checks if a record is a primary color
const isRecordPrimary = (record) => {
  const color = record.color || ""
  return (color === "red" || color === "yellow" || color === "blue")
}

// Retrieves records with specified options
const retrieve = (options = {}) => {
  // Filtering options
  const pageSize = 10
  const page = options.page || 1
  const colors = options.colors || []

  // Create endpoint request URL
  const requestURL = URI(window.path)
    .addSearch("limit", page ? pageSize + 1 : 0) // Extra record to check next page
    .addSearch("offset", page ? (page - 1) * pageSize : 0) // Offset calculated with page size
    .addSearch("color[]", colors)

  let result = {
    "ids": [],
    "open": [],
    "closedPrimaryCount": 0,
    "previousPage": null,
    "nextPage": null,
  }

  // Calls the endpoint and then processes result
  return getRecordsAPI(requestURL).then(records => {
    result.previousPage = (page >= 2) ? page - 1 : result.previousPage
    result.nextPage = (records.length === pageSize + 1) ? page + 1 : result.nextPage

    records.forEach((item, index) => {
      if (index === pageSize) {
        return // Skip extra record
      }

      result.ids.push(item.id)
      if (item.disposition === "open") {
        item.isPrimary = (isRecordPrimary(item))
        result.open.push(item)
      } else {
        if (isRecordPrimary(item)) {
          result.closedPrimaryCount++
        }
      }
    })

    return result
  }).catch(error => {
    console.log("Retrieve records error")
    console.log(error)
    return result
  })
}


export default retrieve
