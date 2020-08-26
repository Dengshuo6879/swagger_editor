import PetstoreYaml from "./petstore"
import YAML from 'json2yaml';
const CONTENT_KEY = "swagger-editor-content"

let localStorage = window.localStorage

export const updateSpec = (ori) => (...args) => {
  let [spec] = args
  ori(...args)
  saveContentToStorage(spec)
}

export default function (system) {
  // setTimeout runs on the next tick
  setTimeout(() => {

    // if(localStorage.getItem(CONTENT_KEY)) {
    //   system.specActions.updateSpec(localStorage.getItem(CONTENT_KEY), "local-storage")
    // } else
    // if (localStorage.getItem("ngStorage-SwaggerEditorCache")) {
    //   // Legacy migration for swagger-editor 2.x
    //   try {
    //     let obj = JSON.parse(localStorage.getItem("ngStorage-SwaggerEditorCache"))
    //     let yaml = obj.yaml
    //     system.specActions.updateSpec(yaml)
    //     saveContentToStorage(yaml)
    //     localStorage.setItem("ngStorage-SwaggerEditorCache", null)
    //   } catch (e) {
    //     system.specActions.updateSpec(PetstoreYaml)
    //   }
    // } else {
    //   system.specActions.updateSpec(PetstoreYaml)
    // }


    // 先加载请求后存在本地的json文件，如果没有则加载默认文件
    if (localStorage.getItem('oas_json')) {
      system.specActions.updateSpec(YAML.stringify(JSON.parse(localStorage.getItem('oas_json'))));
    } else {
      const specJson = {
        "swagger": "2.0",
        "info": {
          "title": "Swagger Petstore",
          "version": "1.0.0"
        },
        "host": "petstore.swagger.io",
        "basePath": "/v2",
        "tags": [
          {
            "name": "pet",
            "description": "Everything about your Pets"
          }
        ],
        "schemes": [
          "https",
          "http"
        ],
        "paths": {
          "/pet": {
            "post": {
              "tags": [
                "pet"
              ],
              "summary": "Add a new pet to the store",
              "description": "",
              "operationId": "addPet",
              "consumes": [
                "application/json",
                "application/xml"
              ],
              "produces": [
                "application/xml",
                "application/json"
              ],
              "parameters": [
                {
                  "in": "body",
                  "name": "body",
                  "description": "Pet object that needs to be added to the store",
                  "required": true,
                  "schema": {
                    "type": "object",
                    "required": [
                      "name",
                      "photoUrls"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "example": "doggie"
                      },
                      "photoUrls": {
                        "type": "array",
                        "xml": {
                          "name": "photoUrl",
                          "wrapped": true
                        },
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              ],
              "responses": {
                "405": {
                  "description": "Invalid input"
                }
              }
            }
          }
        }
      }
      system.specActions.updateSpec(YAML.stringify(specJson));
    }
  }, 0)
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec
        }
      }
    }
  }
}

function saveContentToStorage(str) {
  return localStorage.setItem(CONTENT_KEY, str)
}
