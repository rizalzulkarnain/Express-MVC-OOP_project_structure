- Initial Sequelize `sequlize init`
- Making Model DB `sequelize model:generate --name User --attributes firstName:string,lastName: string,email:string,password:string`
- Migrate DB `sequelize db:migrate`
- Generate Seeder `sequelize seed:generate --name user-seed`
- Running Seeder `sequelize db:seed:all`
- Delete Migrate&Database`sequelize db:migrate:undo:all`
