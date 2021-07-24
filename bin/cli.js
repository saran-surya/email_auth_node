#!/usr/bin/env node
console.log(process.argv)


/**
 * Generates a runtime configuration
 * @param {Array<String>} options 
 */
function generateRuntimeConfig(options) {
    console.log(options.indexOf("--generate"))
    const serverKey = options[options.indexOf("--generate")+1]
    console.log(serverKey)
}


/**
 * Validates the provided command line arguments
 * @param {Array<String>} options 
 */
function validateOptions(options){
    console.log(options)
    options.map((option)=>{
        if(!defaultOptionsList.includes(option)){
            console.log(`Option ${option} is not specified`)
        }
    })
}


const defaultOptionsList = ["--generate"]
const options = process.argv.slice(2)
if(validateOptions(options)){
    generateRuntimeConfig(options)
} else {
    // Add help window section
}