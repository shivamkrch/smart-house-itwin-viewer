import { IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";

export default class Visualization{
    public static hideHouseExterior = async (vp: ScreenViewport, toggle?: boolean)=>{
        const categoryIds = await Visualization.getCategoryIds(vp.iModel);

        if(toggle){

          vp.changeCategoryDisplay(categoryIds, toggle);
        }else{

          vp.changeCategoryDisplay(categoryIds, false);
        }
    }

    private static getCategoryIds = async (iModel: IModelConnection) =>{
        const categoriesToHide = [
            "'Wall 1st'", "'Wall 2nd'", "'Dry Wall 1st'", "'Dry Wall 2nd'",
            "'Brick Exterior'", "'Windows 1st'", "'Windows 2nd'", "'Ceiling 1st'",
            "'Ceiling 2nd'", "'Callouts'", "'Roof'", "'light fixture'"
          ];
    
          const query = `select ECInstanceId from bis.category WHERE Codevalue IN (${categoriesToHide.toString()});`;
    
          const result = iModel.query(query);
    
          const categoryIds=[];
          for await (const row of result){
            categoryIds.push(row.id);
          }

          return categoryIds;
    }
}