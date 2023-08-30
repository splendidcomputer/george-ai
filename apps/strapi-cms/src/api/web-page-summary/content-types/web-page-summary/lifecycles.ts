import { updateTypesenseDocument } from "@george-ai/typesense-client";



export default    {
 async afterCreate(event) {
    const entry = await   strapi.entityService.findOne('api::web-page-summary.web-page-summary', event.result.id, {
      populate: ["scraped_web_pages"]
    })
    // console.log("entry: ", entry);
      updateTypesenseDocument(entry)
    },

  async afterUpdate(event) {
  const entry = await   strapi.entityService.findOne('api::web-page-summary.web-page-summary', event.result.id, {
    populate: ["scraped_web_pages"]
  })
  // console.log("entry: ", entry);
    updateTypesenseDocument(entry)
  },
};
