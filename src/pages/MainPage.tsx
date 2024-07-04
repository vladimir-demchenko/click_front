import { useState, useEffect, useMemo } from 'react'
import useWebSocket from 'react-use-websocket';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import 'dayjs/locale/ru';
import './reset.css';
import { Button, Card, Flex, Form, Input, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';


import cls from './MainPage.module.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

dayjs.locale('ru')


export const MainPage = () => {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState([]);
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/config`
      )
      return data
    }
  });
  const pauseMutation = useMutation({
    mutationFn: (data) => axios.put(API_URL + '/config/1', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['config'] })
  })
  const configMutation = useMutation({
    mutationFn: (data) => axios.put(API_URL + '/config/1', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['config'] })
  })
  const { data: proxies, isLoading: isProxyLoading } = useQuery({
    queryKey: ['proxies'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/proxies/`)
      return data
    }
  });
  const proxiesMutation = useMutation({
    mutationFn: (data: { id: number, body: Record<string, string> }) => axios.put(`${API_URL}/proxies/${data?.id}`, data?.body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proxies'] })
  })
  const [settings, setSettings] = useState(false);
  const API_URL = 'http://206.188.196.107:8000'
  const regex = /^http:\/\/([^:]+:[^@]+)@([^:]+:[^/]+)/

  const handlePause = () => {
    pauseMutation.mutate({
      ...config,
      pause: !config?.pause
    })
  }

  const handleChange = (values: any) => {
    configMutation.mutate({
      ...values,
      pause: config?.pause
    })
  }

  const handleChangeProxy = (values: any, id: number) => {
    proxiesMutation.mutate({
      id: id,
      body: {
        proxy_id: values.proxy_id,
        url: `http://${values['login:password']}@${values['url:port']}`,
        change_ip: values.change_ip
      }
    })
  }

  return (
    <Flex className={cls.mainPage} align='center' justify='space-around' vertical gap={10}>
      <Card style={{ width: '90%', maxHeight: '70vh', overflowY: 'auto' }}>
        <div className={cls.header}>
          <span>Info: </span>
          {/* <span>Количество кликов: {configClicks.clicks ?? 0}/{configClicks.allClicks ?? 0}</span> */}
          <Button onClick={() => setSettings((prev) => !prev)}><SettingOutlined /></Button>
        </div>
        {settings && (
          <Flex style={{ marginTop: 15 }} vertical gap='14px'>
            <Flex align='center' justify='center'>
              <Form onFinish={handleChange} name='config' layout='inline'>
                {/* <Form.Item initialValue={config?.url} name='url' label='Ссылка'><Input /></Form.Item> */}
                <Form.Item initialValue={config?.api_key} name='api_key' label='Ключ API'><Input /></Form.Item>
                <Form.Item><Button htmlType='submit' type='primary'>Сохранить</Button></Form.Item>
              </Form>
            </Flex>
            <div className={cls.formWrapper}>
              <Form onFinish={(values) => handleChangeProxy(values, 1)}
                initialValues={{
                  proxy_id: proxies[0].proxy_id,
                  'url:port': proxies[0].url.match(regex)[2],
                  'login:password': proxies[0].url.match(regex)[1],
                  change_ip: proxies[0].change_ip
                }}
                name='proxy1'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              {/* <Form onFinish={(values) => handleChangeProxy(values, 2)}
                initialValues={proxies[1] ? {
                  proxy_id: proxies[1].proxy_id,
                  'url:port': proxies[1].url.match(regex)[2],
                  'login:password': proxies[1].url.match(regex)[1],
                  change_ip: proxies[1].change_ip
                } : {}}
                name='proxy2'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 3)}
                initialValues={proxies[2] ? {
                  proxy_id: proxies[2].proxy_id,
                  'url:port': proxies[2].url.match(regex)[2],
                  'login:password': proxies[2].url.match(regex)[1],
                  change_ip: proxies[2].change_ip
                } : {}}
                name='proxy3'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 4)}
                initialValues={proxies[3] ? {
                  proxy_id: proxies[3].proxy_id,
                  'url:port': proxies[3].url.match(regex)[2],
                  'login:password': proxies[3].url.match(regex)[1],
                  change_ip: proxies[3].change_ip
                } : {}}
                name='proxy4'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Form onFinish={(values) => handleChangeProxy(values, 5)}
                initialValues={proxies[4] ? {
                  proxy_id: proxies[4].proxy_id,
                  'url:port': proxies[4].url.match(regex)[2],
                  'login:password': proxies[4].url.match(regex)[1],
                  change_ip: proxies[4].change_ip
                } : {}}
                name='proxy5'>
                <Form.Item name='proxy_id' label='Proxy id'>
                  <Input />
                </Form.Item>
                <Form.Item name='url:port' label='Адрес:Порт'>
                  <Input />
                </Form.Item>
                <Form.Item name='login:password' label="Логин:Пароль">
                  <Input />
                </Form.Item>
                <Form.Item name='change_ip' label="Смена IP">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType='submit'>Обновить</Button>
                    <Button>Удалить</Button>
                  </Space>
                </Form.Item>
              </Form> */}
            </div>
          </Flex>
        )
        }
      </Card>
      <Card style={{ width: '90%', height: '70vh', overflowY: 'auto' }}>
        {proxies?.map((proxy: any) => (
          <Link to={`/${proxy?.id}`} key={proxy?.id}>
            <Flex vertical gap='small'>
              <span>{proxy?.proxy_id}</span>
              <span>{proxy?.url}</span>
            </Flex>
          </Link>
        ))}
      </Card>
    </Flex>
  )
}