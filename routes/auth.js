const express = require("express");
const router = express.Router();

const { additional, googleLogin } = require("../controllers/auth");
const upload = require("../services/upload");
const singleUpload = upload.single("user_thumbnail");

/**
 * @swagger
 *  components: 
 *    schemas:
 *      additional:
 *        type: object
 *        required:
 *          - user_name
 *          - blog_address
 *          - wecode_nth
 *          - gmail_id
 *          - gmail
 *        properties:
 *          user_name:
 *            type: string
 *            example: example@example.com
 *          user_thumbnail:
 *            type: string
 *            example: testimg.png
 *          blog_address:
 *            type: string
 *            example: test@velog.io
 *          wecode_nth:
 *            type: integer
 *            example: 10
 *          gmail_id:
 *            type: integer
 *            example: 123
 *          gmail:
 *            type: string
 *            example: test@gmail.com
 *          is_group_joined:
 *            type: boolean
 *            example: true
 *      googleLogin:
 *        type: object
 *        required:
 *          - googleToken
 *        properties:
 *          googleToken:
 *            type: string
 *            example: googleToken
 *            
 */

router.post("/additional", singleUpload, additional);
/**
 * @swagger
 *  /auth/additional:
 *    post:
 *      tags:
 *      - auth
 *      description: 회원가입 후 추가정보 입력
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/additional'
 *      responses:
 *       200:
 *        description: auth of column list
 */

router.post("/login/google", googleLogin);
/**
 * @swagger
 *  /auth/login/google:
 *    post:
 *      tags:
 *      - auth
 *      description: 구글 소셜 로그인
 *      requestBody:
 *        required: true
 *        content:
 *          applicaion/json:
 *            schema:
 *              $ref: '#/components/schemas/googleLogin'
 *      responses:
 *       200:
 *        description: auth of column list
 */

module.exports = router;
