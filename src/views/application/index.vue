<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-col :span="6">
        <el-form-item label="应用名称">
          <el-select v-model="chooseApp" value-key="key" placeholder="请选择你的应用" @change="selectApp">
            <el-option v-for="item in applications"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item>
          <el-button type="default" @click="toAddResource">新增灰度资源</el-button>
        </el-form-item>
      </el-col>
    </el-form>



    <el-table
      :data="resources"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="50%">
      </el-table-column>
      <el-table-column
        prop="resname"
        label="灰度资源"
        style="width:50%">
      </el-table-column>
      <el-table-column
        label="操作"
        style="width:50%">
        <template slot-scope="scope">
          <el-button type="success" @click="toViewReosurce(scope.row)">查看规则</el-button>
          <el-button type="primary" @click="toEditResource(scope.row)">修改规则</el-button>
          <el-button type="danger" @click="doDeleteResource(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>

import axios from 'axios'
export default {
  mounted() {
    this.init()
  },
  data() {
    return {
      applications : new Array(),
      chooseApp : "",
      resources : [],
    }

  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    init(){

      //- LOAD ALL APPS
      axios({
        method: 'get',
        url: 'http://localhost:8089/app/load'
      }).then(response => {
          console.log(response.data)
          let body = response.data.body;

          for (let i in body){
            this.$data.applications.push({
               key : body[i],
               label : body[i],
               value : body[i]
            })
          }

          console.log(this.$data.applications)
      })
    },
    selectApp(appName){
      //- LOAD ALL RESOURCES BY APP
      axios({
        method: 'get',
        url: 'http://localhost:8089/resource/load?appName='+appName
      }).then(response => {
        let body = response.data.body;
        this.$data.resources = [];
        for (let i in body){
          this.$data.resources.push({
            id : i,
            resname : body[i]
          })
        }
        console.log(this.$data.applications)
      })
    },
    toAddResource(){
        if (this.$data.chooseApp == ""){
          alert('请首先选择你要配置的应用!')
          return;
        }

      this.$router.push({
          path:'/resourceruleadd/add',
          query : {
              appName : this.$data.chooseApp
          }
      })
    },
    toViewReosurce(row){
      this.$router.push({
        path:'/resourceruleview/view',
        query : {
          appName : this.$data.chooseApp,
          resourceName : row.resname
        }
      })
    },
    doDeleteResource(row){
      if (confirm("你确定要删除该规则吗?删除后，该资源将全量放开调用")){
        axios({
          method: 'get',
          url: 'http://localhost:8089/resource/delete?appName='+this.$data.chooseApp+'&resource='+row.resname
        }).then(response => {
            this.selectApp(this.$data.chooseApp)
        })
      }
    },
    toEditResource(row){
      this.$router.push({
        path:'/resourceruleupdate/update',
        query : {
          appName : this.$data.chooseApp,
          resourceName : row.resname
        }
      })
    }





  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

